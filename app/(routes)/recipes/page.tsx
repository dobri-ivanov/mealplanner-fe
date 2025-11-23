'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, Eye } from 'lucide-react'
import Link from 'next/link'
import { recipeService } from '@/services'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { RecipeDialog } from '@/components/recipes/recipe-dialog'
import { DeleteRecipeDialog } from '@/components/recipes/delete-recipe-dialog'
import type { RecipeDto } from '@/types'

export default function RecipesPage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRecipe, setEditingRecipe] = useState<RecipeDto | null>(null)
  const [deletingRecipe, setDeletingRecipe] = useState<RecipeDto | null>(null)

  const { data: recipes, isLoading } = useQuery({
    queryKey: ['recipes'],
    queryFn: () => recipeService.getAll(),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => recipeService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      toast({
        title: 'Успешно изтриване',
        description: 'Рецептата е изтрита успешно',
      })
      setDeletingRecipe(null)
    },
    onError: (error: any) => {
      toast({
        title: 'Грешка',
        description: error.message || 'Неуспешно изтриване на рецепта',
        variant: 'destructive',
      })
    },
  })

  const handleEdit = (recipe: RecipeDto) => {
    setEditingRecipe(recipe)
    setIsDialogOpen(true)
  }

  const handleDelete = (recipe: RecipeDto) => {
    setDeletingRecipe(recipe)
  }

  const handleAdd = () => {
    setEditingRecipe(null)
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Рецепти</h1>
          <p className="text-muted-foreground">
            Управлявайте вашите рецепти и техните съставки
          </p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Добави рецепта
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes?.map((recipe, index) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>{recipe.name}</CardTitle>
                  <CardDescription>
                    Време за приготвяне: {recipe.cookingTimeMinutes} мин.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Link href={`/recipes/${recipe.id}`}>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Eye className="h-4 w-4" />
                        Детайли
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(recipe)}
                      className="gap-2"
                    >
                      <Pencil className="h-4 w-4" />
                      Редактирай
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(recipe)}
                      className="gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Изтрий
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {recipes?.length === 0 && !isLoading && (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">Няма рецепти. Създайте първата!</p>
          </CardContent>
        </Card>
      )}

      <RecipeDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        recipe={editingRecipe}
      />

      <DeleteRecipeDialog
        open={!!deletingRecipe}
        onOpenChange={(open) => !open && setDeletingRecipe(null)}
        recipe={deletingRecipe}
        onConfirm={() => deletingRecipe && deleteMutation.mutate(deletingRecipe.id)}
      />
    </div>
  )
}
