import axios from "axios"
import { api } from "./apiClient"
import type { Client, Session, SessionRequest, Workout } from "../types/clientTypes"
import type { TrainerDashboard } from "../types/dashboardTypes"

// ---------------- CLIENT MANAGEMENT ----------------

export const getClients = async (): Promise<Client[]> => {
	try {
		const response = await api.get<Client[]>(`/trainer/clients`)
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
			`/trainer/clients/${id}`,
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

export const putClient = async (clientData: Client, id: string): Promise<{ client: Client; success: boolean }> => {
	try {
		const response = await api.put<{ client: Client; success: boolean }>(
			`/trainer/clients/${id}`,
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

export const deleteClient = async (id: string): Promise<Client> => {
	try {
		const response = await api.delete<Client>(`/trainer/clients/${id}`)
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

// ---------------- WORKOUTS MANAGEMENT ----------------

export const getWorkouts = async (clientId: string): Promise<Workout[]> => {
	try {
		const response = await api.get<Workout[]>(`/trainer/clients/${clientId}/workouts`)
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
			`/trainer/clients/${clientId}/workouts/${workoutId}`,
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
			`/trainer/clients/${clientId}/workouts`,
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
			`/trainer/clients/${clientId}/workouts/${workoutId}`,
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
			`/trainer/clients/${clientId}/workouts/${workoutId}`,
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

// ---------------- SESSIONS MANAGEMENT ----------------

export const getSessions = async (
	filter?: string,
	clientId?: string,
	timeRange?: string,
	specificDate?: Date | null
): Promise<Session[]> => {
	try {
		const params = new URLSearchParams()

		if (filter) params.append('filter', filter)
		if (timeRange) params.append('timeRange', timeRange)
		if (specificDate) {
			// Format date as YYYY-MM-DD for backend
			const year = specificDate.getFullYear()
			const month = String(specificDate.getMonth() + 1).padStart(2, '0')
			const day = String(specificDate.getDate()).padStart(2, '0')
			params.append('specificDate', `${year}-${month}-${day}`)
		}

		const queryString = params.toString()
		let url = clientId ? `/trainer/sessions/${clientId}` : '/trainer/sessions'
		if (queryString) url += `?${queryString}`

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
		const response = await api.post('/trainer/sessions', sessionData)
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
		const response = await api.patch(`/trainer/sessions/${sessionId}`, { status })
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
		const response = await api.put(`/trainer/sessions/${sessionId}`, sessionData)
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

// ---------------- TRAINER DASHBOARD ----------------

export const getTrainerDashboard = async (): Promise<TrainerDashboard> => {
	try {
		const response = await api.get<TrainerDashboard>('/trainer/dashboard')
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
