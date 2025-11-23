import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { categoriesService } from "@/services/categories.service"
import type { CreateUpdateCategoryDto } from "@/types/category"
import { useToast } from "@/hooks/use-toast"

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesService.getAll(),
  })
}

export function useCategory(id: number) {
  return useQuery({
    queryKey: ["categories", id],
    queryFn: () => categoriesService.getById(id),
    enabled: !!id,
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: CreateUpdateCategoryDto) =>
      categoriesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      toast({
        title: "Успех",
        description: "Категорията е създадена успешно",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Грешка",
        description: error.message || "Неуспешно създаване на категория",
        variant: "destructive",
      })
    },
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: CreateUpdateCategoryDto
    }) => categoriesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      toast({
        title: "Успех",
        description: "Категорията е обновена успешно",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Грешка",
        description: error.message || "Неуспешно обновяване на категория",
        variant: "destructive",
      })
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (id: number) => categoriesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      toast({
        title: "Успех",
        description: "Категорията е изтрита успешно",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Грешка",
        description: error.message || "Неуспешно изтриване на категория",
        variant: "destructive",
      })
    },
  })
}

