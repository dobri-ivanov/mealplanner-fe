import { apiClient } from '@/lib/api-client'
import type {
  MealPlanDto,
  CreateUpdateMealPlanDto,
  MealPlanRecipeDto,
  AddOrUpdateMealPlanRecipeDto,
} from '@/types'

export const mealPlanService = {
  // Get all meal plans
  getAll: async (): Promise<MealPlanDto[]> => {
    return apiClient<MealPlanDto[]>('/api/mealplans')
  },

  // Get meal plan by ID
  getById: async (id: number): Promise<MealPlanDto> => {
    return apiClient<MealPlanDto>(`/api/mealplans/${id}`)
  },

  // Create meal plan
  create: async (data: CreateUpdateMealPlanDto): Promise<MealPlanDto> => {
    return apiClient<MealPlanDto>('/api/mealplans', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Update meal plan
  update: async (id: number, data: CreateUpdateMealPlanDto): Promise<MealPlanDto> => {
    return apiClient<MealPlanDto>(`/api/mealplans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  // Delete meal plan
  delete: async (id: number): Promise<void> => {
    return apiClient<void>(`/api/mealplans/${id}`, {
      method: 'DELETE',
    })
  },

  // Get recipes in meal plan
  getRecipes: async (mealPlanId: number): Promise<MealPlanRecipeDto[]> => {
    return apiClient<MealPlanRecipeDto[]>(`/api/mealplans/${mealPlanId}/recipes`)
  },

  // Add recipe to meal plan
  addRecipe: async (
    mealPlanId: number,
    data: AddOrUpdateMealPlanRecipeDto
  ): Promise<MealPlanRecipeDto> => {
    return apiClient<MealPlanRecipeDto>(`/api/mealplans/${mealPlanId}/recipes`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Delete recipe from meal plan
  deleteRecipe: async (
    mealPlanId: number,
    recipeId: number,
    dayOfWeek: number,
    mealType: string
  ): Promise<void> => {
    return apiClient<void>(
      `/api/mealplans/${mealPlanId}/recipes/${recipeId}/${dayOfWeek}/${mealType}`,
      {
        method: 'DELETE',
      }
    )
  },
}

