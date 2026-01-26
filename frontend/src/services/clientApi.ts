import axios from "axios"
import { api } from "./apiClient"

// ---------------- CLIENT DASHBOARD ----------------

export const getClientDashboard = async (): Promise<any> => {
	try {
		const response = await api.get(`/client/dashboard`)
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


// ---------------- CLIENT WORKOUTS ----------------

export const getWorkouts = async () => {
	try {
		const response = await api.get(`/client/workouts`)
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


// ---------------- CLIENT SESSIONS ----------------

export const getSessions = async () => {
	try {
		const response = await api.get(`/client/sessions`)
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