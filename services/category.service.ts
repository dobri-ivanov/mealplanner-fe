import { apiClient } from '@/lib/api-client'
import type { CategoryDto, CreateUpdateCategoryDto } from '@/types'

export const categoryService = {
  // Get all categories
  getAll: async (): Promise<CategoryDto[]> => {
    return apiClient<CategoryDto[]>('/api/categories')
  },

  // Get category by ID
  getById: async (id: number): Promise<CategoryDto> => {
    return apiClient<CategoryDto>(`/api/categories/${id}`)
  },

  // Create category
  create: async (data: CreateUpdateCategoryDto): Promise<CategoryDto> => {
    return apiClient<CategoryDto>('/api/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Update category
  update: async (id: number, data: CreateUpdateCategoryDto): Promise<CategoryDto> => {
    return apiClient<CategoryDto>(`/api/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  // Delete category
  delete: async (id: number): Promise<void> => {
    return apiClient<void>(`/api/categories/${id}`, {
      method: 'DELETE',
    })
  },
}

