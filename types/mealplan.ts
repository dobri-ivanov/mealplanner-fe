// MealPlan DTOs
export interface MealPlanDto {
  id: number
  userId: number
  name: string
  startDate: string
  endDate: string
}

export interface CreateUpdateMealPlanDto {
  userId: number
  name: string
  startDate: string
  endDate: string
}

export interface MealPlanRecipeDto {
  recipeId: number
  dayOfWeek: number
  mealType: string
  recipeName: string
  cookingTimeMinutes: number
}

export interface AddOrUpdateMealPlanRecipeDto {
  recipeId: number
  dayOfWeek: number
  mealType: string
}

