import { apiClient } from '@/lib/api-client'
import type { IngredientDto, CreateIngredientDto, UpdateIngredientDto } from '@/types'

export const ingredientService = {
  // Get all ingredients
  getAll: async (): Promise<IngredientDto[]> => {
    return apiClient<IngredientDto[]>('/api/ingredients')
  },

  // Get ingredient by ID
  getById: async (id: number): Promise<IngredientDto> => {
    return apiClient<IngredientDto>(`/api/ingredients/${id}`)
  },

  // Create ingredient
  create: async (data: CreateIngredientDto): Promise<IngredientDto> => {
    return apiClient<IngredientDto>('/api/ingredients', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Update ingredient
  update: async (id: number, data: UpdateIngredientDto): Promise<IngredientDto> => {
    return apiClient<IngredientDto>(`/api/ingredients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  // Delete ingredient
  delete: async (id: number): Promise<void> => {
    return apiClient<void>(`/api/ingredients/${id}`, {
      method: 'DELETE',
    })
  },
}

