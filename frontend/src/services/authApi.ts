import axios from "axios"
import { api } from "./apiClient"
import type { ClientInvite } from "../types/clientTypes"

// ---------------- AUTHENTICATION ----------------

export const syncUser = async (): Promise<any> => {
	try {
		const response = await api.get('/auth/sync-user')  // Backend verifies Clerk token, returns MongoDB user
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

export const createProfile = async (profileData: {
	firstName: string
	lastName: string
	email: string
	profileType: 'trainer' | 'client'
	age?: string
	weight?: string
	goal?: string
	notes?: string
	trainerType?: string
	inviteToken?: string
}): Promise<any> => {
	try {
		const response = await api.post('/auth/create-profile', profileData)
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

// ---------------- CLIENT INVITES ----------------

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
