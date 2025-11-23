import { apiClient } from "@/lib/api-client"
import type { UserDto, CreateUpdateUserDto, LoginDto } from "@/types/user"

export const usersService = {
  getAll: async (): Promise<UserDto[]> => {
    return apiClient<UserDto[]>("/api/users")
  },

  getById: async (id: number): Promise<UserDto> => {
    return apiClient<UserDto>(`/api/users/${id}`)
  },

  create: async (data: CreateUpdateUserDto): Promise<UserDto> => {
    return apiClient<UserDto>("/api/users", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  update: async (id: number, data: CreateUpdateUserDto): Promise<UserDto> => {
    return apiClient<UserDto>(`/api/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  delete: async (id: number): Promise<void> => {
    return apiClient<void>(`/api/users/${id}`, {
      method: "DELETE",
    })
  },

  login: async (data: LoginDto): Promise<UserDto> => {
    return apiClient<UserDto>("/api/users/login", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },
}

