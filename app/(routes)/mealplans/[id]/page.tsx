'use client'

import { useParams } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Plus, Trash2, Clock } from 'lucide-react'
import { mealPlanService, recipeService } from '@/services'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { MealPlanRecipeDialog } from '@/components/mealplans/mealplan-recipe-dialog'
import { DeleteMealPlanRecipeDialog } from '@/components/mealplans/delete-mealplan-recipe-dialog'
import type { MealPlanRecipeDto, AddOrUpdateMealPlanRecipeDto } from '@/types'
import { format } from 'date-fns'
import { bg } from 'date-fns/locale/bg'
import { useState } from 'react'

const DAYS_OF_WEEK = [
  'Неделя',
  'Понеделник',
  'Вторник',
  'Сряда',
  'Четвъртък',
  'Петък',
  'Събота',
]

const MEAL_TYPES = ['Закуска', 'Обяд', 'Вечеря', 'Снакс']

export default function MealPlanDetailPage() {
  const params = useParams()
  const mealPlanId = parseInt(params.id as string)
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isRecipeDialogOpen, setIsRecipeDialogOpen] = useState(false)
  const [editingRecipe, setEditingRecipe] = useState<MealPlanRecipeDto | null>(null)
  const [deletingRecipe, setDeletingRecipe] = useState<MealPlanRecipeDto | null>(null)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [selectedMealType, setSelectedMealType] = useState<string | null>(null)

  const { data: mealPlan, isLoading: mealPlanLoading } = useQuery({
    queryKey: ['mealplans', mealPlanId],
    queryFn: () => mealPlanService.getById(mealPlanId),
    enabled: !!mealPlanId,
  })

  const { data: recipes, isLoading: recipesLoading } = useQuery({
    queryKey: ['mealplans', mealPlanId, 'recipes'],
    queryFn: () => mealPlanService.getRecipes(mealPlanId),
    enabled: !!mealPlanId,
  })

  const { data: allRecipes } = useQuery({
    queryKey: ['recipes'],
    queryFn: () => recipeService.getAll(),
  })

  const deleteRecipeMutation = useMutation({
    mutationFn: ({
      recipeId,
      dayOfWeek,
      mealType,
    }: {
      recipeId: number
      dayOfWeek: number
      mealType: string
    }) => mealPlanService.deleteRecipe(mealPlanId, recipeId, dayOfWeek, mealType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mealplans', mealPlanId, 'recipes'] })
      toast({
        title: 'Успешно изтриване',
        description: 'Рецептата е премахната от плана',
      })
      setDeletingRecipe(null)
    },
    onError: (error: any) => {
      toast({
        title: 'Грешка',
        description: error.message || 'Неуспешно изтриване на рецепта',
        variant: 'destructive',
      })
    },
  })

  const handleAddRecipe = (dayOfWeek: number, mealType: string) => {
    setSelectedDay(dayOfWeek)
    setSelectedMealType(mealType)
    setEditingRecipe(null)
    setIsRecipeDialogOpen(true)
  }

  const handleEditRecipe = (recipe: MealPlanRecipeDto) => {
    setSelectedDay(recipe.dayOfWeek)
    setSelectedMealType(recipe.mealType)
    setEditingRecipe(recipe)
    setIsRecipeDialogOpen(true)
  }

  const handleDeleteRecipe = (recipe: MealPlanRecipeDto) => {
    setDeletingRecipe(recipe)
  }

  const getRecipesForDayAndMeal = (dayOfWeek: number, mealType: string) => {
    return recipes?.filter(
      (r) => r.dayOfWeek === dayOfWeek && r.mealType === mealType
    ) || []
  }

  if (mealPlanLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!mealPlan) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Планът за хранене не е намерен</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div>
          <h1 className="text-3xl font-bold">{mealPlan.name}</h1>
          <p className="text-muted-foreground mt-2">
            {format(new Date(mealPlan.startDate), 'dd MMM yyyy', { locale: bg })} -{' '}
            {format(new Date(mealPlan.endDate), 'dd MMM yyyy', { locale: bg })}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
          {DAYS_OF_WEEK.map((day, dayIndex) => (
            <Card key={dayIndex}>
              <CardHeader>
                <CardTitle className="text-lg">{day}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {MEAL_TYPES.map((mealType) => {
                  const dayRecipes = getRecipesForDayAndMeal(dayIndex, mealType)
                  return (
                    <div key={mealType} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">{mealType}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAddRecipe(dayIndex, mealType)}
                          className="h-6 w-6 p-0"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {recipesLoading ? (
                        <Skeleton className="h-16 w-full" />
                      ) : dayRecipes.length > 0 ? (
                        <div className="space-y-1">
                          {dayRecipes.map((recipe) => (
                            <motion.div
                              key={`${recipe.recipeId}-${recipe.dayOfWeek}-${recipe.mealType}`}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="p-2 bg-muted rounded text-sm"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className="font-medium">{recipe.recipeName}</p>
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    {recipe.cookingTimeMinutes} мин
                                  </div>
                                </div>
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditRecipe(recipe)}
                                    className="h-6 w-6 p-0"
                                  >
                                    Редактирай
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteRecipe(recipe)}
                                    className="h-6 w-6 p-0 text-destructive"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground">Няма рецепта</p>
                      )}
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      <MealPlanRecipeDialog
        open={isRecipeDialogOpen}
        onOpenChange={setIsRecipeDialogOpen}
        mealPlanId={mealPlanId}
        recipe={editingRecipe}
        allRecipes={allRecipes || []}
        defaultDay={selectedDay}
        defaultMealType={selectedMealType}
      />

      <DeleteMealPlanRecipeDialog
        open={!!deletingRecipe}
        onOpenChange={(open) => !open && setDeletingRecipe(null)}
        recipe={deletingRecipe}
        onConfirm={() =>
          deletingRecipe &&
          deleteRecipeMutation.mutate({
            recipeId: deletingRecipe.recipeId,
            dayOfWeek: deletingRecipe.dayOfWeek,
            mealType: deletingRecipe.mealType,
          })
        }
      />
    </div>
  )
}

