'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { mealPlanService } from '@/services'
import { useToast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { MealPlanRecipeDto, AddOrUpdateMealPlanRecipeDto, RecipeDto } from '@/types'

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

const recipeSchema = z.object({
  recipeId: z.coerce.number().min(1, 'Рецептата е задължителна'),
  dayOfWeek: z.coerce.number().min(0).max(6),
  mealType: z.string().min(1, 'Типът хранене е задължителен'),
})

type RecipeFormData = z.infer<typeof recipeSchema>

interface MealPlanRecipeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mealPlanId: number
  recipe?: MealPlanRecipeDto | null
  allRecipes: RecipeDto[]
  defaultDay?: number | null
  defaultMealType?: string | null
}

export function MealPlanRecipeDialog({
  open,
  onOpenChange,
  mealPlanId,
  recipe,
  allRecipes,
  defaultDay,
  defaultMealType,
}: MealPlanRecipeDialogProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const {
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RecipeFormData>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      recipeId: 0,
      dayOfWeek: defaultDay ?? 0,
      mealType: defaultMealType || '',
    },
  })

  useEffect(() => {
    if (recipe) {
      reset({
        recipeId: recipe.recipeId,
        dayOfWeek: recipe.dayOfWeek,
        mealType: recipe.mealType,
      })
    } else {
      reset({
        recipeId: 0,
        dayOfWeek: defaultDay ?? 0,
        mealType: defaultMealType || '',
      })
    }
  }, [recipe, defaultDay, defaultMealType, reset])

  const addMutation = useMutation({
    mutationFn: (data: AddOrUpdateMealPlanRecipeDto) =>
      mealPlanService.addRecipe(mealPlanId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mealplans', mealPlanId, 'recipes'] })
      toast({
        title: 'Успешно добавяне',
        description: 'Рецептата е добавена към плана',
      })
      onOpenChange(false)
      reset()
    },
    onError: (error: any) => {
      toast({
        title: 'Грешка',
        description: error.message || 'Неуспешно добавяне на рецепта',
        variant: 'destructive',
      })
    },
  })

  const onSubmit = (data: RecipeFormData) => {
    const recipeData: AddOrUpdateMealPlanRecipeDto = {
      recipeId: data.recipeId,
      dayOfWeek: data.dayOfWeek,
      mealType: data.mealType,
    }

    addMutation.mutate(recipeData)
  }

  const isLoading = addMutation.isPending
  const recipeId = watch('recipeId')
  const dayOfWeek = watch('dayOfWeek')
  const mealType = watch('mealType')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{recipe ? 'Редактирай рецепта' : 'Добави рецепта'}</DialogTitle>
          <DialogDescription>
            {recipe
              ? 'Променете рецептата в плана'
              : 'Добавете рецепта към плана за хранене'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipeId">Рецепта</Label>
            <Select
              value={recipeId?.toString() || ''}
              onValueChange={(value) => setValue('recipeId', parseInt(value))}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Изберете рецепта" />
              </SelectTrigger>
              <SelectContent>
                {allRecipes.map((rec) => (
                  <SelectItem key={rec.id} value={rec.id.toString()}>
                    {rec.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.recipeId && (
              <p className="text-sm text-destructive">{errors.recipeId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dayOfWeek">Ден от седмицата</Label>
            <Select
              value={dayOfWeek?.toString() || ''}
              onValueChange={(value) => setValue('dayOfWeek', parseInt(value))}
              disabled={isLoading || !!recipe}
            >
              <SelectTrigger>
                <SelectValue placeholder="Изберете ден" />
              </SelectTrigger>
              <SelectContent>
                {DAYS_OF_WEEK.map((day, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.dayOfWeek && (
              <p className="text-sm text-destructive">{errors.dayOfWeek.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="mealType">Тип хранене</Label>
            <Select
              value={mealType || ''}
              onValueChange={(value) => setValue('mealType', value)}
              disabled={isLoading || !!recipe}
            >
              <SelectTrigger>
                <SelectValue placeholder="Изберете тип хранене" />
              </SelectTrigger>
              <SelectContent>
                {MEAL_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.mealType && (
              <p className="text-sm text-destructive">{errors.mealType.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отказ
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Запазване...' : recipe ? 'Запази' : 'Добави'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

