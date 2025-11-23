'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, Eye } from 'lucide-react'
import Link from 'next/link'
import { mealPlanService } from '@/services'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { MealPlanDialog } from '@/components/mealplans/mealplan-dialog'
import { DeleteMealPlanDialog } from '@/components/mealplans/delete-mealplan-dialog'
import type { MealPlanDto } from '@/types'
import { format } from 'date-fns'
import { bg } from 'date-fns/locale/bg'

export default function MealPlansPage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMealPlan, setEditingMealPlan] = useState<MealPlanDto | null>(null)
  const [deletingMealPlan, setDeletingMealPlan] = useState<MealPlanDto | null>(null)

  const { data: mealPlans, isLoading } = useQuery({
    queryKey: ['mealplans'],
    queryFn: () => mealPlanService.getAll(),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => mealPlanService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mealplans'] })
      toast({
        title: 'Успешно изтриване',
        description: 'Планът за хранене е изтрит успешно',
      })
      setDeletingMealPlan(null)
    },
    onError: (error: any) => {
      toast({
        title: 'Грешка',
        description: error.message || 'Неуспешно изтриване на план',
        variant: 'destructive',
      })
    },
  })

  const handleEdit = (mealPlan: MealPlanDto) => {
    setEditingMealPlan(mealPlan)
    setIsDialogOpen(true)
  }

  const handleDelete = (mealPlan: MealPlanDto) => {
    setDeletingMealPlan(mealPlan)
  }

  const handleAdd = () => {
    setEditingMealPlan(null)
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Планове за хранене</h1>
          <p className="text-muted-foreground">
            Управлявайте вашите седмични планове за хранене
          </p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Добави план
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
          {mealPlans?.map((mealPlan, index) => (
            <motion.div
              key={mealPlan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>{mealPlan.name}</CardTitle>
                  <CardDescription>
                    {format(new Date(mealPlan.startDate), 'dd MMM yyyy', { locale: bg })} -{' '}
                    {format(new Date(mealPlan.endDate), 'dd MMM yyyy', { locale: bg })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Link href={`/mealplans/${mealPlan.id}`}>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Eye className="h-4 w-4" />
                        Детайли
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(mealPlan)}
                      className="gap-2"
                    >
                      <Pencil className="h-4 w-4" />
                      Редактирай
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(mealPlan)}
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

      {mealPlans?.length === 0 && !isLoading && (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">Няма планове. Създайте първия!</p>
          </CardContent>
        </Card>
      )}

      <MealPlanDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        mealPlan={editingMealPlan}
      />

      <DeleteMealPlanDialog
        open={!!deletingMealPlan}
        onOpenChange={(open) => !open && setDeletingMealPlan(null)}
        mealPlan={deletingMealPlan}
        onConfirm={() => deletingMealPlan && deleteMutation.mutate(deletingMealPlan.id)}
      />
    </div>
  )
}

