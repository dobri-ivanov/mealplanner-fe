import { apiClient } from "@/lib/api-client"
import type {
  CategoryDto,
  CreateUpdateCategoryDto,
  UpdateCategoryDto,
} from "@/types/category"

export const categoriesService = {
  getAll: async (): Promise<CategoryDto[]> => {
    return apiClient<CategoryDto[]>("/api/categories")
  },

  getById: async (id: number): Promise<CategoryDto> => {
    return apiClient<CategoryDto>(`/api/categories/${id}`)
  },

  create: async (data: CreateUpdateCategoryDto): Promise<CategoryDto> => {
    return apiClient<CategoryDto>("/api/categories", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  update: async (
    id: number,
    data: CreateUpdateCategoryDto
  ): Promise<CategoryDto> => {
    return apiClient<CategoryDto>(`/api/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  delete: async (id: number): Promise<void> => {
    return apiClient<void>(`/api/categories/${id}`, {
      method: "DELETE",
    })
  },
}

