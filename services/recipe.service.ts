import { apiClient } from '@/lib/api-client'
import type {
  RecipeDto,
  CreateUpdateRecipeDto,
  RecipeIngredientDto,
  AddOrUpdateRecipeIngredientDto,
} from '@/types'

export const recipeService = {
  // Get all recipes
  getAll: async (): Promise<RecipeDto[]> => {
    return apiClient<RecipeDto[]>('/api/recipes')
  },

  // Get recipe by ID
  getById: async (id: number): Promise<RecipeDto> => {
    return apiClient<RecipeDto>(`/api/recipes/${id}`)
  },

  // Create recipe
  create: async (data: CreateUpdateRecipeDto): Promise<RecipeDto> => {
    return apiClient<RecipeDto>('/api/recipes', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Update recipe
  update: async (id: number, data: CreateUpdateRecipeDto): Promise<RecipeDto> => {
    return apiClient<RecipeDto>(`/api/recipes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  // Delete recipe
  delete: async (id: number): Promise<void> => {
    return apiClient<void>(`/api/recipes/${id}`, {
      method: 'DELETE',
    })
  },

  // Get recipe ingredients
  getIngredients: async (recipeId: number): Promise<RecipeIngredientDto[]> => {
    return apiClient<RecipeIngredientDto[]>(`/api/recipes/${recipeId}/ingredients`)
  },

  // Add ingredient to recipe
  addIngredient: async (
    recipeId: number,
    data: AddOrUpdateRecipeIngredientDto
  ): Promise<RecipeIngredientDto> => {
    return apiClient<RecipeIngredientDto>(`/api/recipes/${recipeId}/ingredients`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Delete ingredient from recipe
  deleteIngredient: async (recipeId: number, ingredientId: number): Promise<void> => {
    return apiClient<void>(`/api/recipes/${recipeId}/ingredients/${ingredientId}`, {
      method: 'DELETE',
    })
  },
}

