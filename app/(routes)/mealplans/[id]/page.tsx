'use client'

import { useParams } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Plus, Trash2, Clock, Download } from 'lucide-react'
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
import { exportMealPlanToPDF } from '@/lib/pdf-export'

const DAYS_OF_WEEK = [
  'Понеделник',
  'Вторник',
  'Сряда',
  'Четвъртък',
  'Петък',
  'Събота',
  'Неделя',
]

// Helper функции за конвертиране между UI индекси (0=Понеделник) и API индекси (0=Неделя)
// UI: Понеделник=0, Вторник=1, ..., Неделя=6
// API: Неделя=0, Понеделник=1, ..., Събота=6
const uiToApiDay = (uiIndex: number): number => {
  // UI 0 (Понеделник) -> API 1
  // UI 1 (Вторник) -> API 2
  // ...
  // UI 5 (Събота) -> API 6
  // UI 6 (Неделя) -> API 0
  return uiIndex === 6 ? 0 : uiIndex + 1
}

const apiToUiDay = (apiIndex: number): number => {
  // API 0 (Неделя) -> UI 6
  // API 1 (Понеделник) -> UI 0
  // API 2 (Вторник) -> UI 1
  // ...
  // API 6 (Събота) -> UI 5
  return apiIndex === 0 ? 6 : apiIndex - 1
}

const MEAL_TYPES = ['Закуска', 'Обяд', 'Вечеря', 'Снакс']

export default function MealPlanDetailPage() {
  const params = useParams()
  const mealPlanId = parseInt(params.id as string)
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isRecipeDialogOpen, setIsRecipeDialogOpen] = useState(false)
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

  const handleAddRecipe = (uiDayIndex: number, mealType: string) => {
    const apiDayIndex = uiToApiDay(uiDayIndex)
    setSelectedDay(apiDayIndex)
    setSelectedMealType(mealType)
    setIsRecipeDialogOpen(true)
  }


  const handleDeleteRecipe = (recipe: MealPlanRecipeDto) => {
    setDeletingRecipe(recipe)
  }

  const getRecipesForDayAndMeal = (uiDayIndex: number, mealType: string) => {
    const apiDayIndex = uiToApiDay(uiDayIndex)
    return recipes?.filter(
      (r) => r.dayOfWeek === apiDayIndex && r.mealType === mealType
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{mealPlan.name}</h1>
            <p className="text-muted-foreground mt-2">
              {format(new Date(mealPlan.startDate), 'dd MMM yyyy', { locale: bg })} -{' '}
              {format(new Date(mealPlan.endDate), 'dd MMM yyyy', { locale: bg })}
            </p>
          </div>
          <Button
            onClick={async () => {
              if (mealPlan && recipes) {
                try {
                  await exportMealPlanToPDF(mealPlan, recipes)
                  toast({
                    title: 'Успешно експортиране',
                    description: 'Планът за хранене е експортиран като PDF',
                  })
                } catch (error) {
                  toast({
                    title: 'Грешка',
                    description: 'Неуспешно експортиране на PDF',
                    variant: 'destructive',
                  })
                }
              }
            }}
            className="gap-2"
            disabled={!mealPlan || !recipes || recipesLoading}
          >
            <Download className="h-4 w-4" />
            Експортирай PDF
          </Button>
        </div>

        <div className="mt-8">
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
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium">{mealType}</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddRecipe(dayIndex, mealType)}
                          className="h-6 px-1.5 gap-1 text-xs"
                        >
                          <Plus className="h-3 w-3" />
                          Добави
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
                              className="p-3 bg-background border border-border rounded-md text-sm"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-base">{recipe.recipeName}</p>
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                    <Clock className="h-3 w-3" />
                                    {recipe.cookingTimeMinutes} мин
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteRecipe(recipe)}
                                  className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                                  title="Изтрий рецепта"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-2 bg-muted/50 rounded text-xs text-muted-foreground text-center border border-dashed">
                          Няма рецепта. Кликнете "Добави" за да добавите рецепта.
                        </div>
                      )}
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          ))}
          </div>
        </div>
      </motion.div>

      <MealPlanRecipeDialog
        open={isRecipeDialogOpen}
        onOpenChange={setIsRecipeDialogOpen}
        mealPlanId={mealPlanId}
        recipe={null}
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

