'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { recipeService } from '@/services'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { RecipeIngredientDto, AddOrUpdateRecipeIngredientDto, IngredientDto } from '@/types'

const ingredientSchema = z.object({
  ingredientId: z.coerce.number().min(1, 'Съставката е задължителна'),
  quantity: z.coerce.number().min(0.01, 'Количеството трябва да е по-голямо от 0'),
})

type IngredientFormData = z.infer<typeof ingredientSchema>

interface RecipeIngredientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  recipeId: number
  ingredient?: RecipeIngredientDto | null
  allIngredients: IngredientDto[]
}

export function RecipeIngredientDialog({
  open,
  onOpenChange,
  recipeId,
  ingredient,
  allIngredients,
}: RecipeIngredientDialogProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IngredientFormData>({
    resolver: zodResolver(ingredientSchema),
    defaultValues: {
      ingredientId: 0,
      quantity: 0,
    },
  })

  useEffect(() => {
    if (ingredient) {
      reset({
        ingredientId: ingredient.ingredientId,
        quantity: ingredient.quantity,
      })
    } else {
      reset({
        ingredientId: 0,
        quantity: 0,
      })
    }
  }, [ingredient, reset])

  const addMutation = useMutation({
    mutationFn: (data: AddOrUpdateRecipeIngredientDto) =>
      recipeService.addIngredient(recipeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes', recipeId, 'ingredients'] })
      toast({
        title: 'Успешно добавяне',
        description: 'Съставката е добавена към рецептата',
      })
      onOpenChange(false)
      reset()
    },
    onError: (error: any) => {
      toast({
        title: 'Грешка',
        description: error.message || 'Неуспешно добавяне на съставка',
        variant: 'destructive',
      })
    },
  })

  const onSubmit = (data: IngredientFormData) => {
    const ingredientData: AddOrUpdateRecipeIngredientDto = {
      ingredientId: data.ingredientId,
      quantity: data.quantity,
    }

    addMutation.mutate(ingredientData)
  }

  const isLoading = addMutation.isPending
  const ingredientId = watch('ingredientId')

  // Get available ingredients (exclude already added ones if editing)
  const availableIngredients = allIngredients.filter(
    (ing) => !ingredient || ing.id === ingredient.ingredientId || !ingredientId
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {ingredient ? 'Редактирай съставка' : 'Добави съставка'}
          </DialogTitle>
          <DialogDescription>
            {ingredient
              ? 'Променете количеството на съставката'
              : 'Добавете съставка към рецептата'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ingredientId">Съставка</Label>
            <Select
              value={ingredientId?.toString() || ''}
              onValueChange={(value) => setValue('ingredientId', parseInt(value))}
              disabled={isLoading || !!ingredient}
            >
              <SelectTrigger>
                <SelectValue placeholder="Изберете съставка" />
              </SelectTrigger>
              <SelectContent>
                {availableIngredients.map((ing) => (
                  <SelectItem key={ing.id} value={ing.id.toString()}>
                    {ing.name} ({ing.unit})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.ingredientId && (
              <p className="text-sm text-destructive">{errors.ingredientId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Количество</Label>
            <Input
              id="quantity"
              type="number"
              step="0.01"
              {...register('quantity')}
              placeholder="0.00"
              disabled={isLoading}
            />
            {errors.quantity && (
              <p className="text-sm text-destructive">{errors.quantity.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отказ
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Запазване...' : ingredient ? 'Запази' : 'Добави'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

