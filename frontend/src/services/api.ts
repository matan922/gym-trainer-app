import axios, { type AxiosResponse } from "axios"
import { useAuthStore } from "../store/authStore"
import type { Client, ClientInvite, SessionRequest, Workout } from "../types/clientTypes"
import type { Dashboard } from "../types/dashboardTypes"


const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/"
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

// ---------------- CLIENT DATA ----------------
export const getClients = async () => {
	try {
		const response = await api.get<Client[]>(`/clients`)
		return response
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response) {
				return error.response.data
			}
			return { success: false, message: "Cannot connect to server" }
		}
		return { success: false, message: "Something went wrong" }
	}

}

export const getClient = async (id: string) => {
	try {
		const response = await api.get<{ client: Client; workouts: Workout[] }>(
			`/clients/${id}`,
		)
		return response
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response) {
				return error.response.data
			}
			return { success: false, message: "Cannot connect to server" }
		}
		return { success: false, message: "Something went wrong" }
	}

}

export const sendClientInvite = async (clientData: ClientInvite) => {
	try {
		const response = await api.post<ClientInvite>(`/auth/send-client-invite`, clientData)
		return response.data
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response) {
				return error.response.data
			}
			return { success: false, message: "Cannot connect to server" }
		}
		return { success: false, message: "Something went wrong" }
	}

}

export const validateClientInvite = async (inviteToken: string) => {
	try {
		const response = await api.post('/auth/validate-invite-token', { inviteToken })
		return response.data
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response) {
				return error.response.data
			}
			return { success: false, message: "Cannot connect to server" }
		}
		return { success: false, message: "Something went wrong" }
	}
}

export const acceptInviteAuthenticated = async (inviteToken: string) => {
	try {
		const response = await api.post('/auth/invite-accept-authenticated', { inviteToken })
		return response.data
	}
	catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response) {
				return error.response.data
			}
			return { success: false, message: "Cannot connect to server" }
		}
		return { success: false, message: "Something went wrong" }
	}

}
export const putClient = async (clientData: Client, id: string) => {
	try {
		const response = await api.put<{ client: Client; success: boolean }>(
			`/clients/${id}`,
			clientData,
		)
		return response
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response) {
				return error.response.data
			}
			return { success: false, message: "Cannot connect to server" }
		}
		return { success: false, message: "Something went wrong" }
	}

}

export const deleteClient = async (id: string) => {
	const response = await api.delete<Client>(`/clients/${id}`)
	return response
}

// ---------------- WORKOUTS DATA ----------------

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
// ---------------- SESSIONS DATA ----------------

export const getSessions = async () => {
	try {
		const response = await api.get('/sessions')
		return response.data
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response) {
				return error.response.data
			}
			return { success: false, message: "Cannot connect to server" }
		}
		return { success: false, message: "Something went wrong" }
	}
}

export const postSessions = async (sessionData: SessionRequest) => {
	try {
		const response = await api.post('/sessions', sessionData)
		console.log(response)
		return response.data
	}
	catch (error) {
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

export const updateSessionStatus = async (sessionId: string, status: string) => {
	try {
		const response = await api.patch(`/sessions/${sessionId}`, { status })
		return response.data
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response) {
				return error.response.data
			}
			return { success: false, message: "Cannot connect to server" }
		}
		return { success: false, message: "Something went wrong" }
	}
}

export const updateSession = async (sessionId: string, sessionData: any) => {
	try {
		const response = await api.put(`/sessions/${sessionId}`, sessionData)
		return response.data
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response) {
				return error.response.data
			}
			return { success: false, message: "Cannot connect to server" }
		}
		return { success: false, message: "Something went wrong" }
	}
}


// ---------------- DASHBOARD ---------------------

export const getDashboard = async (): Promise<Dashboard | { message: string }> => {
	try {
		const response = await api.get('/trainer/dashboard')
		return response.data
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response) {
				return error.response.data
			}
			return { message: "Cannot connect to server" }
		}
		return { message: "Something went wrong" }

	}
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
	inviteToken?: string
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

export const verifyEmail = async (token: string) => {
	try {
		console.log(token)
		const response = await api.post(`/auth/verify-email`, { token: token })
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