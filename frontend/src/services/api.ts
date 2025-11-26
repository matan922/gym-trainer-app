import axios, { type AxiosResponse } from "axios"
import dayjs from "dayjs"
import { jwtDecode } from "jwt-decode"
import { useAuthStore } from "../store/authStore"
import type { Client, Workout } from "../types/clientTypes"

const API_BASE_URL = "http://localhost:5000"
const api = axios.create({
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
		const { status } = error.response
		const originalRequest = error.config

		if (
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

// ---------------- CLIENT DATA FETCH ----------------
export const getClients = async () => {
	const response = await api.get<Client[]>(`/clients`)
	return response
}

export const getClient = async (id: string) => {
	const response = await api.get<{ client: Client; workouts: Workout[] }>(
		`/clients/${id}`,
	)
	return response
}

export const postClient = async (clientData: Client) => {
	const response = await api.post<Client>(`/clients`, clientData)
	return response
}

export const putClient = async (clientData: Client, id: string) => {
	const response = await api.put<{ client: Client; success: boolean }>(
		`/clients/${id}`,
		clientData,
	)
	return response
}

export const deleteClient = async (id: string) => {
	const response = await api.delete<Client>(`/clients/${id}`)
	return response
}

// ---------------- WORKOUTS DATA FETCH ----------------

export const getWorkouts = async (clientId: string) => {
	const response = await api.get<Workout[]>(`/clients/${clientId}/workouts`)
	return response
}

export const getWorkout = async (clientId: string, workoutId: string) => {
	const response = await api.get<Workout>(
		`/clients/${clientId}/workouts/${workoutId}`,
	)
	return response.data
}

export const postWorkout = async (clientId: string, workoutData: Workout) => {
	const response = await api.post<Workout>(
		`/clients/${clientId}/workouts`,
		workoutData,
	)
	return response
}

export const putWorkout = async (
	clientId: string,
	workoutData: Workout,
	workoutId: string,
) => {
	const response = await api.put<Workout>(
		`/clients/${clientId}/workouts/${workoutId}`,
		workoutData,
	)
	return response.data
}

export const deleteWorkout = async (clientId: string, workoutId: string) => {
	const response = await api.delete<Workout>(
		`/clients/${clientId}/workouts/${workoutId}`,
	)
	return response
}

// ---------------- AUTHENTICATION ----------------

export const login = async (userData: { email: string; password: string }) => {
	try {
		const response = await api.post(`/auth/login`, userData)
		return response.data
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response) {
				// Server responded with error
				return error.response.data
			}
			// Network error
			return { success: false, message: "Cannot connect to server" }
		}
		// Unexpected error
		return { success: false, message: "Something went wrong" }
	}
}

export const refresh = async () => {
	try {
		const response = await api.post(`/auth/token`)
		return response.data
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response) {
				// Server responded with error
				return error.response.data
			}
			// Network error
			return { success: false, message: "Cannot connect to server" }
		}
		// Unexpected error
		return { success: false, message: "Something went wrong" }
	}
}

export const register = async (userData: {
	firstName: string
	lastName: string
	email: string
	password: string
}) => {
	try {
		const response = await api.post(`/auth/register`, userData)
		console.log(response.data)
		return response.data
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response) {
				// Server responded with error
				return error.response.data
			}
			// Network error
			return { success: false, message: "Cannot connect to server" }
		}
		// Unexpected error
		return { success: false, message: "Something went wrong" }
	}
}

export const logout = async () => {
	try {
		const response = await api.delete(`/auth/logout`)
		return response.data
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response) {
				// Server responded with error
				console.log(error)
				return error.response.data
			}
			// Network error
			return { success: false, message: "Cannot connect to server" }
		}
		// Unexpected error
		return { success: false, message: "Something went wrong" }
	}
}
