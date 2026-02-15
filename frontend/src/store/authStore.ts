import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  activeProfile: 'trainer' | 'client'
}

interface AuthState {
  user: User | null
  setUser: (user: User) => void
  clearUser: () => void
}

export const useAuthStore = create(
  persist(
    (set): AuthState => ({
      user: null,
      setUser: (user: User) => {
        set({ user })
      },
      clearUser: () => set({ user: null })
    }),
    {
      name: 'auth-storage', // localStorage key name
    }
  )
)