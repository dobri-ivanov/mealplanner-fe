'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { mealPlanService } from '@/services'
import { useAuthStore } from '@/lib/auth-store'
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
import type { MealPlanDto, CreateUpdateMealPlanDto } from '@/types'

const mealPlanSchema = z.object({
  name: z.string().min(1, 'Името е задължително'),
  startDate: z.string().min(1, 'Началната дата е задължителна'),
  endDate: z.string().min(1, 'Крайната дата е задължителна'),
})

type MealPlanFormData = z.infer<typeof mealPlanSchema>

interface MealPlanDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mealPlan?: MealPlanDto | null
}

export function MealPlanDialog({ open, onOpenChange, mealPlan }: MealPlanDialogProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const user = useAuthStore((state) => state.user)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MealPlanFormData>({
    resolver: zodResolver(mealPlanSchema),
    defaultValues: {
      name: '',
      startDate: '',
      endDate: '',
    },
  })

  useEffect(() => {
    if (mealPlan) {
      // Format dates for input (YYYY-MM-DD)
      const startDate = new Date(mealPlan.startDate).toISOString().split('T')[0]
      const endDate = new Date(mealPlan.endDate).toISOString().split('T')[0]
      reset({
        name: mealPlan.name,
        startDate,
        endDate,
      })
    } else {
      // Set default dates (current week)
      const today = new Date()
      const startOfWeek = new Date(today)
      startOfWeek.setDate(today.getDate() - today.getDay())
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)

      reset({
        name: '',
        startDate: startOfWeek.toISOString().split('T')[0],
        endDate: endOfWeek.toISOString().split('T')[0],
      })
    }
  }, [mealPlan, reset])

  const createMutation = useMutation({
    mutationFn: (data: CreateUpdateMealPlanDto) => mealPlanService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mealplans'] })
      toast({
        title: 'Успешно създаване',
        description: 'Планът за хранене е създаден успешно',
      })
      onOpenChange(false)
      reset()
    },
    onError: (error: any) => {
      toast({
        title: 'Грешка',
        description: error.message || 'Неуспешно създаване на план',
        variant: 'destructive',
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateUpdateMealPlanDto }) =>
      mealPlanService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mealplans'] })
      toast({
        title: 'Успешно обновяване',
        description: 'Планът за хранене е обновен успешно',
      })
      onOpenChange(false)
      reset()
    },
    onError: (error: any) => {
      toast({
        title: 'Грешка',
        description: error.message || 'Неуспешно обновяване на план',
        variant: 'destructive',
      })
    },
  })

  const onSubmit = (data: MealPlanFormData) => {
    if (!user) {
      toast({
        title: 'Грешка',
        description: 'Трябва да сте влезли в системата',
        variant: 'destructive',
      })
      return
    }

    const mealPlanData: CreateUpdateMealPlanDto = {
      ...data,
      userId: user.id,
    }

    if (mealPlan) {
      updateMutation.mutate({ id: mealPlan.id, data: mealPlanData })
    } else {
      createMutation.mutate(mealPlanData)
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mealPlan ? 'Редактирай план' : 'Добави план'}</DialogTitle>
          <DialogDescription>
            {mealPlan
              ? 'Променете информацията за плана за хранене'
              : 'Създайте нов план за хранене'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Име</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Въведете име на плана"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">Начална дата</Label>
            <Input
              id="startDate"
              type="date"
              {...register('startDate')}
              disabled={isLoading}
            />
            {errors.startDate && (
              <p className="text-sm text-destructive">{errors.startDate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">Крайна дата</Label>
            <Input
              id="endDate"
              type="date"
              {...register('endDate')}
              disabled={isLoading}
            />
            {errors.endDate && (
              <p className="text-sm text-destructive">{errors.endDate.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отказ
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Запазване...' : mealPlan ? 'Запази' : 'Създай'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

