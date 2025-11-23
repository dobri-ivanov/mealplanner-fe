'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ingredientService } from '@/services'
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
import type { IngredientDto, CreateIngredientDto, UpdateIngredientDto } from '@/types'

const ingredientSchema = z.object({
  name: z.string().min(1, 'Името е задължително'),
  unit: z.string().min(1, 'Мерната единица е задължителна'),
})

type IngredientFormData = z.infer<typeof ingredientSchema>

interface IngredientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ingredient?: IngredientDto | null
}

export function IngredientDialog({ open, onOpenChange, ingredient }: IngredientDialogProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IngredientFormData>({
    resolver: zodResolver(ingredientSchema),
    defaultValues: {
      name: '',
      unit: '',
    },
  })

  useEffect(() => {
    if (ingredient) {
      reset({
        name: ingredient.name,
        unit: ingredient.unit,
      })
    } else {
      reset({
        name: '',
        unit: '',
      })
    }
  }, [ingredient, reset])

  const createMutation = useMutation({
    mutationFn: (data: CreateIngredientDto) => ingredientService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] })
      toast({
        title: 'Успешно създаване',
        description: 'Съставката е създадена успешно',
      })
      onOpenChange(false)
      reset()
    },
    onError: (error: any) => {
      toast({
        title: 'Грешка',
        description: error.message || 'Неуспешно създаване на съставка',
        variant: 'destructive',
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateIngredientDto }) =>
      ingredientService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] })
      toast({
        title: 'Успешно обновяване',
        description: 'Съставката е обновена успешно',
      })
      onOpenChange(false)
      reset()
    },
    onError: (error: any) => {
      toast({
        title: 'Грешка',
        description: error.message || 'Неуспешно обновяване на съставка',
        variant: 'destructive',
      })
    },
  })

  const onSubmit = (data: IngredientFormData) => {
    if (ingredient) {
      updateMutation.mutate({ id: ingredient.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{ingredient ? 'Редактирай съставка' : 'Добави съставка'}</DialogTitle>
          <DialogDescription>
            {ingredient
              ? 'Променете информацията за съставката'
              : 'Добавете нова съставка в системата'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Име</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Въведете име на съставката"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="unit">Мерна единица</Label>
            <Input
              id="unit"
              {...register('unit')}
              placeholder="Напр. кг, л, бр."
              disabled={isLoading}
            />
            {errors.unit && (
              <p className="text-sm text-destructive">{errors.unit.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отказ
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Запазване...' : ingredient ? 'Запази' : 'Създай'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

