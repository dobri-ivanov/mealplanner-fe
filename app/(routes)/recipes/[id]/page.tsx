'use client'

import { useParams } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Plus, Trash2, Clock } from 'lucide-react'
import { recipeService, ingredientService } from '@/services'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { RecipeIngredientDialog } from '@/components/recipes/recipe-ingredient-dialog'
import { DeleteRecipeIngredientDialog } from '@/components/recipes/delete-recipe-ingredient-dialog'
import type { RecipeIngredientDto, AddOrUpdateRecipeIngredientDto } from '@/types'
import { useState } from 'react'

export default function RecipeDetailPage() {
  const params = useParams()
  const recipeId = parseInt(params.id as string)
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isIngredientDialogOpen, setIsIngredientDialogOpen] = useState(false)
  const [editingIngredient, setEditingIngredient] = useState<RecipeIngredientDto | null>(null)
  const [deletingIngredient, setDeletingIngredient] = useState<RecipeIngredientDto | null>(null)

  const { data: recipe, isLoading: recipeLoading } = useQuery({
    queryKey: ['recipes', recipeId],
    queryFn: () => recipeService.getById(recipeId),
    enabled: !!recipeId,
  })

  const { data: ingredients, isLoading: ingredientsLoading } = useQuery({
    queryKey: ['recipes', recipeId, 'ingredients'],
    queryFn: () => recipeService.getIngredients(recipeId),
    enabled: !!recipeId,
  })

  const { data: allIngredients } = useQuery({
    queryKey: ['ingredients'],
    queryFn: () => ingredientService.getAll(),
  })

  const deleteIngredientMutation = useMutation({
    mutationFn: (ingredientId: number) =>
      recipeService.deleteIngredient(recipeId, ingredientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes', recipeId, 'ingredients'] })
      toast({
        title: 'Успешно изтриване',
        description: 'Съставката е премахната от рецептата',
      })
      setDeletingIngredient(null)
    },
    onError: (error: any) => {
      toast({
        title: 'Грешка',
        description: error.message || 'Неуспешно изтриване на съставка',
        variant: 'destructive',
      })
    },
  })

  const handleAddIngredient = () => {
    setEditingIngredient(null)
    setIsIngredientDialogOpen(true)
  }

  const handleEditIngredient = (ingredient: RecipeIngredientDto) => {
    setEditingIngredient(ingredient)
    setIsIngredientDialogOpen(true)
  }

  const handleDeleteIngredient = (ingredient: RecipeIngredientDto) => {
    setDeletingIngredient(ingredient)
  }

  if (recipeLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Рецептата не е намерена</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{recipe.name}</h1>
            <div className="flex items-center gap-2 mt-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Време за приготвяне: {recipe.cookingTimeMinutes} минути</span>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Инструкции</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{recipe.instructions}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Съставки</CardTitle>
              <Button onClick={handleAddIngredient} size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Добави съставка
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {ingredientsLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : ingredients && ingredients.length > 0 ? (
              <div className="space-y-2">
                {ingredients.map((ingredient, index) => (
                  <motion.div
                    key={`${ingredient.ingredientId}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{ingredient.ingredientName}</p>
                      <p className="text-sm text-muted-foreground">
                        {ingredient.quantity} {ingredient.unit}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditIngredient(ingredient)}
                      >
                        Редактирай
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteIngredient(ingredient)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Няма добавени съставки. Добавете първата!
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <RecipeIngredientDialog
        open={isIngredientDialogOpen}
        onOpenChange={setIsIngredientDialogOpen}
        recipeId={recipeId}
        ingredient={editingIngredient}
        allIngredients={allIngredients || []}
      />

      <DeleteRecipeIngredientDialog
        open={!!deletingIngredient}
        onOpenChange={(open) => !open && setDeletingIngredient(null)}
        ingredient={deletingIngredient}
        onConfirm={() =>
          deletingIngredient && deleteIngredientMutation.mutate(deletingIngredient.ingredientId)
        }
      />
    </div>
  )
}

