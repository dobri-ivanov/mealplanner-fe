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
import type { RecipeIngredientDto } from '@/types'

interface DeleteRecipeIngredientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ingredient: RecipeIngredientDto | null
  onConfirm: () => void
}

export function DeleteRecipeIngredientDialog({
  open,
  onOpenChange,
  ingredient,
  onConfirm,
}: DeleteRecipeIngredientDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Сигурни ли сте?</AlertDialogTitle>
          <AlertDialogDescription>
            Това действие не може да бъде отменено. Това ще премахне съставката{' '}
            <strong>{ingredient?.ingredientName}</strong> от рецептата.
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

