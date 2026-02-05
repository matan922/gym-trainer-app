import axios from "axios"
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
			console.log('Token being sent:', token)
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
