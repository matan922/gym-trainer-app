import axios from "axios"
import { getClerkToken } from "../utils/tokenProvider"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/"

export const api = axios.create({
	baseURL: API_BASE_URL,
	withCredentials: true, // Enable sending cookies with requests
})

api.interceptors.request.use(
	async (config) => {
		const authUrls = ["/auth/login", "/auth/token", "/auth/register"]
		const isAuthEndpoint = authUrls.some((url) => config.url?.includes(url))

		// Get fresh token from Clerk for non-auth endpoints
		if (!isAuthEndpoint) {
			const token = await getClerkToken()
			console.log('interceptor got token?', token)
			if (token) {
				config.headers["Authorization"] = `Bearer ${token}`
			}
		}

		console.log('config',config)
		return config
	},
	(error) => {
		console.log(error)
		return Promise.reject(error)
	},
)
