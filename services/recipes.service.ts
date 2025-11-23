import { apiClient } from "@/lib/api-client"
import type {
  RecipeDto,
  CreateUpdateRecipeDto,
  RecipeIngredientDto,
  AddOrUpdateRecipeIngredientDto,
} from "@/types/recipe"

export const recipesService = {
  getAll: async (): Promise<RecipeDto[]> => {
    return apiClient<RecipeDto[]>("/api/recipes")
  },

  getById: async (id: number): Promise<RecipeDto> => {
    return apiClient<RecipeDto>(`/api/recipes/${id}`)
  },

  create: async (data: CreateUpdateRecipeDto): Promise<RecipeDto> => {
    return apiClient<RecipeDto>("/api/recipes", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  update: async (
    id: number,
    data: CreateUpdateRecipeDto
  ): Promise<RecipeDto> => {
    return apiClient<RecipeDto>(`/api/recipes/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  delete: async (id: number): Promise<void> => {
    return apiClient<void>(`/api/recipes/${id}`, {
      method: "DELETE",
    })
  },

  // Recipe Ingredients
  getIngredients: async (
    recipeId: number
  ): Promise<RecipeIngredientDto[]> => {
    return apiClient<RecipeIngredientDto[]>(
      `/api/recipes/${recipeId}/ingredients`
    )
  },

  addIngredient: async (
    recipeId: number,
    data: AddOrUpdateRecipeIngredientDto
  ): Promise<RecipeIngredientDto> => {
    return apiClient<RecipeIngredientDto>(
      `/api/recipes/${recipeId}/ingredients`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    )
  },

  removeIngredient: async (
    recipeId: number,
    ingredientId: number
  ): Promise<void> => {
    return apiClient<void>(
      `/api/recipes/${recipeId}/ingredients/${ingredientId}`,
      {
        method: "DELETE",
      }
    )
  },
}

