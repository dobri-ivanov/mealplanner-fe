'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserDto } from '@/types'

interface AuthState {
  user: UserDto | null
  isAuthenticated: boolean
  setUser: (user: UserDto | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
)

