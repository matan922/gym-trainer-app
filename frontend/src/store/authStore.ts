import { create } from 'zustand'

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
  setUser: (user: User) => void  // NEW
  clearToken: () => void
}

export const useAuthStore = create((set): AuthState => ({
  token: null,
  user: null,
  setToken: (newToken: string) => {
    set({ token: newToken })
  },
  setUser: (user: User) => {
    set({ user })
  },
  clearToken: () => set({ token: null, user: null })
}))