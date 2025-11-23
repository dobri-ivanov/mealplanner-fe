import { apiClient } from '@/lib/api-client'
import type { UserDto, CreateUpdateUserDto, LoginDto } from '@/types'

export const userService = {
  // Get all users
  getAll: async (): Promise<UserDto[]> => {
    return apiClient<UserDto[]>('/api/users')
  },

  // Get user by ID
  getById: async (id: number): Promise<UserDto> => {
    return apiClient<UserDto>(`/api/users/${id}`)
  },

  // Create user
  create: async (data: CreateUpdateUserDto): Promise<UserDto> => {
    return apiClient<UserDto>('/api/users', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Update user
  update: async (id: number, data: CreateUpdateUserDto): Promise<UserDto> => {
    return apiClient<UserDto>(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  // Delete user
  delete: async (id: number): Promise<void> => {
    return apiClient<void>(`/api/users/${id}`, {
      method: 'DELETE',
    })
  },

  // Login
  login: async (data: LoginDto): Promise<UserDto> => {
    return apiClient<UserDto>('/api/users/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
}

