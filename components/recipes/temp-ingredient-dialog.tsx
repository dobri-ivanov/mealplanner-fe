'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
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
import type { IngredientDto } from '@/types'

const ingredientSchema = z.object({
  ingredientId: z.coerce.number().min(1, 'Съставката е задължителна'),
  quantity: z.coerce.number().min(0.01, 'Количеството трябва да е по-голямо от 0'),
})

type IngredientFormData = z.infer<typeof ingredientSchema>

interface TempIngredient {
  ingredientId: number
  quantity: number
  ingredientName: string
  unit: string
}

interface TempIngredientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ingredient?: TempIngredient | null
  allIngredients: IngredientDto[]
  existingIngredientIds?: number[]
  onSave: (ingredientId: number, quantity: number) => void
}

export function TempIngredientDialog({
  open,
  onOpenChange,
  ingredient,
  allIngredients,
  existingIngredientIds = [],
  onSave,
}: TempIngredientDialogProps) {
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
  }, [ingredient, reset, open])

  const onSubmit = (data: IngredientFormData) => {
    onSave(data.ingredientId, data.quantity)
  }

  const ingredientId = watch('ingredientId')
  
  // Филтрираме съставките, които вече са добавени (само при добавяне, не при редактиране)
  const availableIngredients = ingredient
    ? allIngredients // При редактиране показваме всички
    : allIngredients.filter(
        (ing) => !existingIngredientIds.includes(ing.id) || ing.id === ingredientId
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
              disabled={!!ingredient}
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
            />
            {errors.quantity && (
              <p className="text-sm text-destructive">{errors.quantity.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отказ
            </Button>
            <Button type="submit">
              {ingredient ? 'Запази' : 'Добави'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

