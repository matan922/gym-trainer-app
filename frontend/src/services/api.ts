import axios, { type AxiosResponse } from "axios"
import { useAuthStore } from "../store/authStore"
import type { Client, ClientInvite, Session, SessionRequest, Workout } from "../types/clientTypes"
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
export const getClients = async (): Promise<Client[]> => {
	try {
		const response = await api.get<Client[]>(`/clients`)
		return response.data
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response) {
				throw new Error(error.response.data?.message || "Server error")
			}
			throw new Error("Cannot connect to server")
		}
		throw new Error("Something went wrong")
	}
}

export const getClient = async (id: string): Promise<{ client: Client; workouts: Workout[] }> => {
	try {
		const response = await api.get<{ client: Client; workouts: Workout[] }>(
			`/clients/${id}`,
		)
		return response.data
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response) {
				throw new Error(error.response.data?.message || "Server error")
			}
			throw new Error("Cannot connect to server")
		}
		throw new Error("Something went wrong")
	}
}

export const sendClientInvite = async (clientData: ClientInvite): Promise<ClientInvite> => {
	try {
		const response = await api.post<ClientInvite>(`/auth/send-client-invite`, clientData)
		return response.data
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response) {
				throw new Error(error.response.data?.message || "Server error")
			}
			throw new Error("Cannot connect to server")
		}
		throw new Error("Something went wrong")
	}
}

export const validateClientInvite = async (inviteToken: string): Promise<any> => {
	try {
		const response = await api.post('/auth/validate-invite-token', { inviteToken })
		return response.data
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response) {
				throw new Error(error.response.data?.message || "Server error")
			}
			throw new Error("Cannot connect to server")
		}
		throw new Error("Something went wrong")
	}
}

export const acceptInviteAuthenticated = async (inviteToken: string): Promise<any> => {
	try {
		const response = await api.post('/auth/invite-accept-authenticated', { inviteToken })
		return response.data
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response) {
				throw new Error(error.response.data?.message || "Server error")
			}
			throw new Error("Cannot connect to server")
		}
		throw new Error("Something went wrong")
	}
}

// may need to remove put client or change it entirely
export const putClient = async (clientData: Client, id: string): Promise<{ client: Client; success: boolean }> => {
	try {
		const response = await api.put<{ client: Client; success: boolean }>(
			`/clients/${id}`,
			clientData,
		)
		return response.data
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response) {
				throw new Error(error.response.data?.message || "Server error")
			}
			throw new Error("Cannot connect to server")
		}
		throw new Error("Something went wrong")
	}
}

// may need to remove delete client or change it entirely
export const deleteClient = async (id: string): Promise<Client> => {
	try {
		const response = await api.delete<Client>(`/clients/${id}`)
		return response.data
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response) {
				throw new Error(error.response.data?.message || "Server error")
			}
			throw new Error("Cannot connect to server")
		}
		throw new Error("Something went wrong")
	}
}

// ---------------- WORKOUTS DATA ----------------

export const getWorkouts = async (clientId: string): Promise<Workout[]> => {
	try {
		const response = await api.get<Workout[]>(`/clients/${clientId}/workouts`)
		return response.data
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response) {
				throw new Error(error.response.data?.message || "Server error")
			}
			throw new Error("Cannot connect to server")
		}
		throw new Error("Something went wrong")
	}
}

export const getWorkout = async (clientId: string, workoutId: string): Promise<Workout> => {
	try {
		const response = await api.get<Workout>(
			`/clients/${clientId}/workouts/${workoutId}`,
		)
		return response.data
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response) {
				throw new Error(error.response.data?.message || "Server error")
			}
			throw new Error("Cannot connect to server")
		}
		throw new Error("Something went wrong")
	}
}

export const postWorkout = async (clientId: string, workoutData: Workout): Promise<Workout> => {
	try {
		const response = await api.post<Workout>(
			`/clients/${clientId}/workouts`,
			workoutData,
		)
		return response.data
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response) {
				throw new Error(error.response.data?.message || "Server error")
			}
			throw new Error("Cannot connect to server")
		}
		throw new Error("Something went wrong")
	}
}

export const putWorkout = async (
	clientId: string,
	workoutData: Workout,
	workoutId: string,
): Promise<Workout> => {
	try {
		const response = await api.put<Workout>(
			`/clients/${clientId}/workouts/${workoutId}`,
			workoutData,
		)
		return response.data
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response) {
				throw new Error(error.response.data?.message || "Server error")
			}
			throw new Error("Cannot connect to server")
		}
		throw new Error("Something went wrong")
	}
}

export const deleteWorkout = async (clientId: string, workoutId: string): Promise<Workout> => {
	try {
		const response = await api.delete<Workout>(
			`/clients/${clientId}/workouts/${workoutId}`,
		)
		return response.data
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response) {
				throw new Error(error.response.data?.message || "Server error")
			}
			throw new Error("Cannot connect to server")
		}
		throw new Error("Something went wrong")
	}
}
// ---------------- SESSIONS DATA ----------------

export const getSessions = async (filter?: string, clientId?: string): Promise<Session[]> => {
	try {
		let url
		if (clientId) {
			url = filter ? `/sessions/${clientId}?filter=${filter}` : `/sessions/${clientId}`
		} else {
			url = filter ? `/sessions?filter=${filter}` : '/sessions'
		}

		const response = await api.get<Session[]>(url)
		return response.data
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response) {
				throw new Error(error.response.data?.message || "Server error")
			}
			throw new Error("Cannot connect to server")
		}
		throw new Error("Something went wrong")
	}
}

export const postSessions = async (sessionData: SessionRequest): Promise<any> => {
	try {
		const response = await api.post('/sessions', sessionData)
		return response.data
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response) {
				throw new Error(error.response.data?.message || "Server error")
			}
			throw new Error("Cannot connect to server")
		}
		throw new Error("Something went wrong")
	}
}

export const updateSessionStatus = async (sessionId: string, status: string): Promise<any> => {
	try {
		const response = await api.patch(`/sessions/${sessionId}`, { status })
		return response.data
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response) {
				throw new Error(error.response.data?.message || "Server error")
			}
			throw new Error("Cannot connect to server")
		}
		throw new Error("Something went wrong")
	}
}

export const updateSession = async (sessionId: string, sessionData: any): Promise<any> => {
	try {
		const response = await api.put(`/sessions/${sessionId}`, sessionData)
		return response.data
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response) {
				throw new Error(error.response.data?.message || "Server error")
			}
			throw new Error("Cannot connect to server")
		}
		throw new Error("Something went wrong")
	}
}


// ---------------- DASHBOARD ---------------------

export const getDashboard = async (): Promise<Dashboard> => {
	try {
		const response = await api.get<Dashboard>('/trainer/dashboard')
		return response.data
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response) {
				throw new Error(error.response.data?.message || "Server error")
			}
			throw new Error("Cannot connect to server")
		}
		throw new Error("Something went wrong")
	}
}


// ---------------- AUTHENTICATION ----------------

export const login = async (userData: { email: string; password: string }): Promise<any> => {
	try {
		const response = await api.post(`/auth/login`, userData)
		return response.data
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response) {
				throw new Error(error.response.data?.message || "Server error")
			}
			throw new Error("Cannot connect to server")
		}
		throw new Error("Something went wrong")
	}
}

export const refresh = async (): Promise<any> => {
	try {
		const response = await api.post(`/auth/token`)
		return response.data
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response) {
				throw new Error(error.response.data?.message || "Server error")
			}
			throw new Error("Cannot connect to server")
		}
		throw new Error("Something went wrong")
	}
}

export const register = async (userData: {
	firstName: string
	lastName: string
	email: string
	password: string
	inviteToken?: string
}): Promise<any> => {
	try {
		const response = await api.post(`/auth/register`, userData)
		console.log(response.data)
		return response.data
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response) {
				throw new Error(error.response.data?.message || "Server error")
			}
			throw new Error("Cannot connect to server")
		}
		throw new Error("Something went wrong")
	}
}

export const logout = async (): Promise<any> => {
	try {
		const response = await api.delete(`/auth/logout`)
		return response.data
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response) {
				console.log(error)
				throw new Error(error.response.data?.message || "Server error")
			}
			throw new Error("Cannot connect to server")
		}
		throw new Error("Something went wrong")
	}
}

export const verifyEmail = async (token: string): Promise<any> => {
	try {
		console.log(token)
		const response = await api.post(`/auth/verify-email`, { token: token })
		return response.data
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response) {
				console.log(error)
				throw new Error(error.response.data?.message || "Server error")
			}
			throw new Error("Cannot connect to server")
		}
		throw new Error("Something went wrong")
	}
}