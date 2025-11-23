import { apiClient } from "@/lib/api-client"
import type {
  IngredientDto,
  CreateIngredientDto,
  UpdateIngredientDto,
} from "@/types/ingredient"

export const ingredientsService = {
  getAll: async (): Promise<IngredientDto[]> => {
    return apiClient<IngredientDto[]>("/api/ingredients")
  },

  getById: async (id: number): Promise<IngredientDto> => {
    return apiClient<IngredientDto>(`/api/ingredients/${id}`)
  },

  create: async (data: CreateIngredientDto): Promise<IngredientDto> => {
    return apiClient<IngredientDto>("/api/ingredients", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  update: async (
    id: number,
    data: UpdateIngredientDto
  ): Promise<IngredientDto> => {
    return apiClient<IngredientDto>(`/api/ingredients/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  delete: async (id: number): Promise<void> => {
    return apiClient<void>(`/api/ingredients/${id}`, {
      method: "DELETE",
    })
  },
}

