import { create } from 'zustand'

interface AuthState {
  token: string | null
  setToken: (token: string) => void
  clearToken: () => void
}

export const useAuthStore = create((set): AuthState => ({
  token: null,
  setToken: (newToken: string) => set({ token: newToken }),
  clearToken: () => set({token: null})
}))