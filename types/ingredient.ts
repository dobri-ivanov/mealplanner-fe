// Ingredient DTOs
export interface IngredientDto {
  id: number
  name: string
  unit: string
}

export interface CreateIngredientDto {
  name: string
  unit: string
}

export interface UpdateIngredientDto {
  name?: string
  unit?: string
}

