import { apiClient } from "@/lib/api-client"
import type {
  MealPlanDto,
  CreateUpdateMealPlanDto,
  MealPlanRecipeDto,
  AddOrUpdateMealPlanRecipeDto,
} from "@/types/mealplan"

export const mealplansService = {
  getAll: async (): Promise<MealPlanDto[]> => {
    return apiClient<MealPlanDto[]>("/api/mealplans")
  },

  getById: async (id: number): Promise<MealPlanDto> => {
    return apiClient<MealPlanDto>(`/api/mealplans/${id}`)
  },

  create: async (data: CreateUpdateMealPlanDto): Promise<MealPlanDto> => {
    return apiClient<MealPlanDto>("/api/mealplans", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  update: async (
    id: number,
    data: CreateUpdateMealPlanDto
  ): Promise<MealPlanDto> => {
    return apiClient<MealPlanDto>(`/api/mealplans/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  delete: async (id: number): Promise<void> => {
    return apiClient<void>(`/api/mealplans/${id}`, {
      method: "DELETE",
    })
  },

  // MealPlan Recipes
  getRecipes: async (mealPlanId: number): Promise<MealPlanRecipeDto[]> => {
    return apiClient<MealPlanRecipeDto[]>(
      `/api/mealplans/${mealPlanId}/recipes`
    )
  },

  addRecipe: async (
    mealPlanId: number,
    data: AddOrUpdateMealPlanRecipeDto
  ): Promise<MealPlanRecipeDto> => {
    return apiClient<MealPlanRecipeDto>(
      `/api/mealplans/${mealPlanId}/recipes`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    )
  },

  removeRecipe: async (
    mealPlanId: number,
    recipeId: number,
    dayOfWeek: number,
    mealType: string
  ): Promise<void> => {
    return apiClient<void>(
      `/api/mealplans/${mealPlanId}/recipes/${recipeId}/${dayOfWeek}/${mealType}`,
      {
        method: "DELETE",
      }
    )
  },
}

