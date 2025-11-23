'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { MealPlanRecipeDto } from '@/types'

const DAYS_OF_WEEK = [
  'Неделя',
  'Понеделник',
  'Вторник',
  'Сряда',
  'Четвъртък',
  'Петък',
  'Събота',
]

interface DeleteMealPlanRecipeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  recipe: MealPlanRecipeDto | null
  onConfirm: () => void
}

export function DeleteMealPlanRecipeDialog({
  open,
  onOpenChange,
  recipe,
  onConfirm,
}: DeleteMealPlanRecipeDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Сигурни ли сте?</AlertDialogTitle>
          <AlertDialogDescription>
            Това действие не може да бъде отменено. Това ще премахне рецептата{' '}
            <strong>{recipe?.recipeName}</strong> от{' '}
            <strong>{DAYS_OF_WEEK[recipe?.dayOfWeek || 0]}</strong> -{' '}
            <strong>{recipe?.mealType}</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отказ</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Премахни
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

