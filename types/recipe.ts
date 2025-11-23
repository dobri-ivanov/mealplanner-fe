// Recipe DTOs
export interface RecipeDto {
  id: number
  name: string
  instructions: string
  cookingTimeMinutes: number
  categoryId: number
  authorUserId: number
}

export interface CreateUpdateRecipeDto {
  name: string
  instructions: string
  cookingTimeMinutes: number
  categoryId: number
  authorUserId: number
}

export interface RecipeIngredientDto {
  recipeId: number
  ingredientId: number
  quantity: number
  ingredientName: string
  unit: string
}

export interface AddOrUpdateRecipeIngredientDto {
  ingredientId: number
  quantity: number
}

