import { create } from 'zustand'
import { jwtDecode } from 'jwt-decode'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  activeProfile: 'trainer' | 'client'
}

interface AuthState {
  token: string | null
  user: User | null,
  setToken: (token: string) => void
  clearToken: () => void
}

export const useAuthStore = create((set): AuthState => ({
  token: null,
  user: null,
  setToken: (newToken: string) => {
    const decoded = jwtDecode<User>(newToken)

    set({
      token: newToken,
      user: decoded
    })
  },
  clearToken: () => set({ token: null })
}))