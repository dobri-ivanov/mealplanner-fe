'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Plus, Trash2 } from 'lucide-react'
import { recipeService, categoryService, ingredientService } from '@/services'
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
import type { RecipeDto, CreateUpdateRecipeDto, IngredientDto } from '@/types'
import { TempIngredientDialog } from './temp-ingredient-dialog'

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

interface TempIngredient {
  ingredientId: number
  quantity: number
  ingredientName: string
  unit: string
}

export function RecipeDialog({ open, onOpenChange, recipe }: RecipeDialogProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const user = useAuthStore((state) => state.user)
  const [tempIngredients, setTempIngredients] = useState<TempIngredient[]>([])
  const [isIngredientDialogOpen, setIsIngredientDialogOpen] = useState(false)
  const [editingTempIngredient, setEditingTempIngredient] = useState<TempIngredient | null>(null)

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAll(),
  })

  const { data: allIngredients } = useQuery({
    queryKey: ['ingredients'],
    queryFn: () => ingredientService.getAll(),
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

  // Зареждане на съставките при редактиране
  const { data: existingIngredients } = useQuery({
    queryKey: ['recipes', recipe?.id, 'ingredients'],
    queryFn: () => (recipe ? recipeService.getIngredients(recipe.id) : Promise.resolve([])),
    enabled: !!recipe && open,
  })

  useEffect(() => {
    if (recipe) {
      reset({
        name: recipe.name,
        instructions: recipe.instructions,
        cookingTimeMinutes: recipe.cookingTimeMinutes,
        categoryId: recipe.categoryId,
      })
      // При редактиране зареждаме съществуващите съставки
      if (existingIngredients) {
        const tempIngs: TempIngredient[] = existingIngredients.map((ing) => ({
          ingredientId: ing.ingredientId,
          quantity: ing.quantity,
          ingredientName: ing.ingredientName,
          unit: ing.unit,
        }))
        setTempIngredients(tempIngs)
      }
    } else {
      reset({
        name: '',
        instructions: '',
        cookingTimeMinutes: 30,
        categoryId: 0,
      })
      // При създаване изчистваме временните съставки
      setTempIngredients([])
    }
  }, [recipe, reset, open, existingIngredients])

  const createMutation = useMutation({
    mutationFn: (data: CreateUpdateRecipeDto) => recipeService.create(data),
    onSuccess: async (createdRecipe) => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      
      // Добавяме всички временни съставки към новосъздадената рецепта
      if (tempIngredients.length > 0) {
        try {
          await Promise.all(
            tempIngredients.map((tempIng) =>
              recipeService.addIngredient(createdRecipe.id, {
                ingredientId: tempIng.ingredientId,
                quantity: tempIng.quantity,
              })
            )
          )
          queryClient.invalidateQueries({ queryKey: ['recipes', createdRecipe.id, 'ingredients'] })
        } catch (error: any) {
          toast({
            title: 'Предупреждение',
            description: 'Рецептата е създадена, но има проблеми с добавянето на някои съставки',
            variant: 'destructive',
          })
        }
      }

      toast({
        title: 'Успешно създаване',
        description: 'Рецептата е създадена успешно',
      })
      onOpenChange(false)
      reset()
      setTempIngredients([])
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
    onSuccess: async (updatedRecipe, variables) => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      
      // При редактиране обновяваме съставките
      if (recipe && existingIngredients) {
        try {
          // Намираме кои съставки са добавени, редактирани или изтрити
          const currentIngredientIds = new Set(tempIngredients.map((ing) => ing.ingredientId))
          const existingIngredientIds = new Set(existingIngredients.map((ing) => ing.ingredientId))

          // Изтриваме съставки, които са премахнати
          const toDelete = existingIngredients.filter(
            (ing) => !currentIngredientIds.has(ing.ingredientId)
          )
          await Promise.all(
            toDelete.map((ing) => recipeService.deleteIngredient(recipe.id, ing.ingredientId))
          )

          // Добавяме или обновяваме съставки
          for (const tempIng of tempIngredients) {
            const existing = existingIngredients.find(
              (ing) => ing.ingredientId === tempIng.ingredientId
            )
            if (existing) {
              // Ако количеството е променено, изтриваме и добавяме отново
              if (existing.quantity !== tempIng.quantity) {
                await recipeService.deleteIngredient(recipe.id, tempIng.ingredientId)
                await recipeService.addIngredient(recipe.id, {
                  ingredientId: tempIng.ingredientId,
                  quantity: tempIng.quantity,
                })
              }
            } else {
              // Нова съставка
              await recipeService.addIngredient(recipe.id, {
                ingredientId: tempIng.ingredientId,
                quantity: tempIng.quantity,
              })
            }
          }

          queryClient.invalidateQueries({ queryKey: ['recipes', recipe.id, 'ingredients'] })
        } catch (error: any) {
          toast({
            title: 'Предупреждение',
            description: 'Рецептата е обновена, но има проблеми с обновяването на някои съставки',
            variant: 'destructive',
          })
        }
      }

      toast({
        title: 'Успешно обновяване',
        description: 'Рецептата е обновена успешно',
      })
      onOpenChange(false)
      reset()
      setTempIngredients([])
    },
    onError: (error: any) => {
      toast({
        title: 'Грешка',
        description: error.message || 'Неуспешно обновяване на рецепта',
        variant: 'destructive',
      })
    },
  })

  const handleAddTempIngredient = (ingredientId: number, quantity: number) => {
    const ingredient = allIngredients?.find((ing) => ing.id === ingredientId)
    if (!ingredient) return

    const newIngredient: TempIngredient = {
      ingredientId,
      quantity,
      ingredientName: ingredient.name,
      unit: ingredient.unit,
    }

    if (editingTempIngredient) {
      // Редактиране на съществуваща съставка
      setTempIngredients((prev) =>
        prev.map((ing) =>
          ing.ingredientId === editingTempIngredient.ingredientId ? newIngredient : ing
        )
      )
      setEditingTempIngredient(null)
    } else {
      // Добавяне на нова съставка
      setTempIngredients((prev) => [...prev, newIngredient])
    }
    setIsIngredientDialogOpen(false)
  }

  const handleDeleteTempIngredient = (ingredientId: number) => {
    setTempIngredients((prev) => prev.filter((ing) => ing.ingredientId !== ingredientId))
  }

  const handleEditTempIngredient = (ingredient: TempIngredient) => {
    setEditingTempIngredient(ingredient)
    setIsIngredientDialogOpen(true)
  }

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

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Съставки</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingTempIngredient(null)
                  setIsIngredientDialogOpen(true)
                }}
                disabled={isLoading}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Добави съставка
              </Button>
            </div>
            {tempIngredients.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-2">
                {tempIngredients.map((ingredient, index) => (
                  <motion.div
                    key={`${ingredient.ingredientId}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-2 bg-muted rounded-md"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">{ingredient.ingredientName}</p>
                      <p className="text-xs text-muted-foreground">
                        {ingredient.quantity} {ingredient.unit}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditTempIngredient(ingredient)}
                        disabled={isLoading}
                        className="h-7 px-2 text-xs"
                      >
                        Редактирай
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTempIngredient(ingredient.ingredientId)}
                        disabled={isLoading}
                        className="h-7 w-7 p-0 text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-2 border rounded-md border-dashed">
                Няма добавени съставки. Кликнете "Добави съставка" за да добавите.
              </p>
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

        <TempIngredientDialog
          open={isIngredientDialogOpen}
          onOpenChange={setIsIngredientDialogOpen}
          ingredient={editingTempIngredient}
          allIngredients={allIngredients || []}
          existingIngredientIds={tempIngredients.map((ing) => ing.ingredientId)}
          onSave={handleAddTempIngredient}
        />
      </DialogContent>
    </Dialog>
  )
}

