'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { ingredientService } from '@/services'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { IngredientDialog } from '@/components/ingredients/ingredient-dialog'
import { DeleteIngredientDialog } from '@/components/ingredients/delete-ingredient-dialog'
import type { IngredientDto } from '@/types'

export default function IngredientsPage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingIngredient, setEditingIngredient] = useState<IngredientDto | null>(null)
  const [deletingIngredient, setDeletingIngredient] = useState<IngredientDto | null>(null)

  const { data: ingredients, isLoading } = useQuery({
    queryKey: ['ingredients'],
    queryFn: () => ingredientService.getAll(),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => ingredientService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] })
      toast({
        title: 'Успешно изтриване',
        description: 'Съставката е изтрита успешно',
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

  const handleEdit = (ingredient: IngredientDto) => {
    setEditingIngredient(ingredient)
    setIsDialogOpen(true)
  }

  const handleDelete = (ingredient: IngredientDto) => {
    setDeletingIngredient(ingredient)
  }

  const handleAdd = () => {
    setEditingIngredient(null)
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Съставки</h1>
          <p className="text-muted-foreground">
            Управлявайте съставките, които използвате в рецептите
          </p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Добави съставка
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ingredients?.map((ingredient, index) => (
            <motion.div
              key={ingredient.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>{ingredient.name}</CardTitle>
                  <CardDescription>Мерна единица: {ingredient.unit}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(ingredient)}
                      className="gap-2"
                    >
                      <Pencil className="h-4 w-4" />
                      Редактирай
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(ingredient)}
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

      {ingredients?.length === 0 && !isLoading && (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">Няма съставки. Създайте първата!</p>
          </CardContent>
        </Card>
      )}

      <IngredientDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        ingredient={editingIngredient}
      />

      <DeleteIngredientDialog
        open={!!deletingIngredient}
        onOpenChange={(open) => !open && setDeletingIngredient(null)}
        ingredient={deletingIngredient}
        onConfirm={() => deletingIngredient && deleteMutation.mutate(deletingIngredient.id)}
      />
    </div>
  )
}
