import axios, { type AxiosResponse } from "axios"
import { useAuthStore } from "../store/authStore"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/"

export const api = axios.create({
	baseURL: API_BASE_URL,
	withCredentials: true, // Enable sending cookies with requests
})

api.interceptors.request.use(
	(config) => {
		const authUrls = ["/auth/login", "/auth/token", "/auth/register"]
		const isAuthEndpoint = authUrls.some((url) => config.url?.includes(url))
		// no need to send access token if the request is to any of the authUrls routes
		if (!isAuthEndpoint) {
			const token = useAuthStore.getState().token
			if (token) {
				config.headers["Authorization"] = `Bearer ${token}`
			}
		}
		return config
	},
	(error) => {
		console.log(error)
		return Promise.reject(error)
	},
)

let refreshTokenPromise: Promise<AxiosResponse> | null = null

api.interceptors.response.use(
	(response) => {
		return response
	},
	async (error) => {
		const status = error.response?.status
		const originalRequest = error.config

		if (
			status &&
			(status === 401 || status === 403) &&
			!originalRequest._retry &&
			error.config.url !== "/auth/token"
		) {
			originalRequest._retry = true

			try {
				// Create a single shared refresh request that all concurrent 401s or 403s will reuse. Once complete (success or fail), reset to null to allow future refresh attempts
				if (!refreshTokenPromise) {
					refreshTokenPromise = api.post("/auth/token").finally(() => {
						refreshTokenPromise = null
					})
				}

				const response = await refreshTokenPromise
				const newToken = response.data.accessToken
				api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`
				useAuthStore.getState().setToken(newToken)

				return api(originalRequest)
			} catch (error) {
				return Promise.reject(error)
			}
		}
		return Promise.reject(error)
	},
)
