'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { recipeService, categoryService } from '@/services'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { RecipeDto, CreateUpdateRecipeDto } from '@/types'

const recipeSchema = z.object({
  name: z.string().min(1, 'Името е задължително'),
  instructions: z.string().min(1, 'Инструкциите са задължителни'),
  cookingTimeMinutes: z.coerce.number().min(1, 'Времето за приготвяне трябва да е поне 1 минута'),
  categoryId: z.coerce.number().min(1, 'Категорията е задължителна'),
})

type RecipeFormData = z.infer<typeof recipeSchema>

interface RecipeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  recipe?: RecipeDto | null
}

export function RecipeDialog({ open, onOpenChange, recipe }: RecipeDialogProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const user = useAuthStore((state) => state.user)

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAll(),
  })

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RecipeFormData>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      name: '',
      instructions: '',
      cookingTimeMinutes: 30,
      categoryId: 0,
    },
  })

  useEffect(() => {
    if (recipe) {
      reset({
        name: recipe.name,
        instructions: recipe.instructions,
        cookingTimeMinutes: recipe.cookingTimeMinutes,
        categoryId: recipe.categoryId,
      })
    } else {
      reset({
        name: '',
        instructions: '',
        cookingTimeMinutes: 30,
        categoryId: 0,
      })
    }
  }, [recipe, reset])

  const createMutation = useMutation({
    mutationFn: (data: CreateUpdateRecipeDto) => recipeService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      toast({
        title: 'Успешно създаване',
        description: 'Рецептата е създадена успешно',
      })
      onOpenChange(false)
      reset()
    },
    onError: (error: any) => {
      toast({
        title: 'Грешка',
        description: error.message || 'Неуспешно създаване на рецепта',
        variant: 'destructive',
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateUpdateRecipeDto }) =>
      recipeService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      toast({
        title: 'Успешно обновяване',
        description: 'Рецептата е обновена успешно',
      })
      onOpenChange(false)
      reset()
    },
    onError: (error: any) => {
      toast({
        title: 'Грешка',
        description: error.message || 'Неуспешно обновяване на рецепта',
        variant: 'destructive',
      })
    },
  })

  const onSubmit = (data: RecipeFormData) => {
    if (!user) {
      toast({
        title: 'Грешка',
        description: 'Трябва да сте влезли в системата',
        variant: 'destructive',
      })
      return
    }

    const recipeData: CreateUpdateRecipeDto = {
      ...data,
      authorUserId: user.id,
    }

    if (recipe) {
      updateMutation.mutate({ id: recipe.id, data: recipeData })
    } else {
      createMutation.mutate(recipeData)
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending
  const categoryId = watch('categoryId')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{recipe ? 'Редактирай рецепта' : 'Добави рецепта'}</DialogTitle>
          <DialogDescription>
            {recipe
              ? 'Променете информацията за рецептата'
              : 'Добавете нова рецепта в системата'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Име</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Въведете име на рецептата"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId">Категория</Label>
            <Select
              value={categoryId?.toString() || ''}
              onValueChange={(value) => setValue('categoryId', parseInt(value))}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Изберете категория" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && (
              <p className="text-sm text-destructive">{errors.categoryId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cookingTimeMinutes">Време за приготвяне (минути)</Label>
            <Input
              id="cookingTimeMinutes"
              type="number"
              {...register('cookingTimeMinutes')}
              placeholder="30"
              disabled={isLoading}
            />
            {errors.cookingTimeMinutes && (
              <p className="text-sm text-destructive">{errors.cookingTimeMinutes.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Инструкции</Label>
            <textarea
              id="instructions"
              {...register('instructions')}
              placeholder="Въведете инструкции за приготвяне"
              disabled={isLoading}
              className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {errors.instructions && (
              <p className="text-sm text-destructive">{errors.instructions.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отказ
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Запазване...' : recipe ? 'Запази' : 'Създай'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

