'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { categoryService } from '@/services'
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
import type { CategoryDto, CreateUpdateCategoryDto } from '@/types'

const categorySchema = z.object({
  name: z.string().min(1, 'Името е задължително'),
  description: z.string().optional(),
})

type CategoryFormData = z.infer<typeof categorySchema>

interface CategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: CategoryDto | null
}

export function CategoryDialog({ open, onOpenChange, category }: CategoryDialogProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        description: category.description || '',
      })
    } else {
      reset({
        name: '',
        description: '',
      })
    }
  }, [category, reset])

  const createMutation = useMutation({
    mutationFn: (data: CreateUpdateCategoryDto) => categoryService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast({
        title: 'Успешно създаване',
        description: 'Категорията е създадена успешно',
      })
      onOpenChange(false)
      reset()
    },
    onError: (error: any) => {
      toast({
        title: 'Грешка',
        description: error.message || 'Неуспешно създаване на категория',
        variant: 'destructive',
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateUpdateCategoryDto }) =>
      categoryService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast({
        title: 'Успешно обновяване',
        description: 'Категорията е обновена успешно',
      })
      onOpenChange(false)
      reset()
    },
    onError: (error: any) => {
      toast({
        title: 'Грешка',
        description: error.message || 'Неуспешно обновяване на категория',
        variant: 'destructive',
      })
    },
  })

  const onSubmit = (data: CategoryFormData) => {
    if (category) {
      updateMutation.mutate({ id: category.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{category ? 'Редактирай категория' : 'Добави категория'}</DialogTitle>
          <DialogDescription>
            {category
              ? 'Променете информацията за категорията'
              : 'Добавете нова категория в системата'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Име</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Въведете име на категорията"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Input
              id="description"
              {...register('description')}
              placeholder="Въведете описание (незадължително)"
              disabled={isLoading}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отказ
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Запазване...' : category ? 'Запази' : 'Създай'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
