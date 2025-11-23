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
import type { IngredientDto } from '@/types'

interface DeleteIngredientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ingredient: IngredientDto | null
  onConfirm: () => void
}

export function DeleteIngredientDialog({
  open,
  onOpenChange,
  ingredient,
  onConfirm,
}: DeleteIngredientDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Сигурни ли сте?</AlertDialogTitle>
          <AlertDialogDescription>
            Това действие не може да бъде отменено. Това ще изтрие съставката{' '}
            <strong>{ingredient?.name}</strong> перманентно.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отказ</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Изтрий
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

