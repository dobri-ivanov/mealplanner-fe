import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ingredientsService } from "@/services/ingredients.service"
import type { CreateIngredientDto, UpdateIngredientDto } from "@/types/ingredient"
import { useToast } from "@/hooks/use-toast"

export function useIngredients() {
  return useQuery({
    queryKey: ["ingredients"],
    queryFn: () => ingredientsService.getAll(),
  })
}

export function useIngredient(id: number) {
  return useQuery({
    queryKey: ["ingredients", id],
    queryFn: () => ingredientsService.getById(id),
    enabled: !!id,
  })
}

export function useCreateIngredient() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: CreateIngredientDto) =>
      ingredientsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] })
      toast({
        title: "Успех",
        description: "Съставката е създадена успешно",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Грешка",
        description: error.message || "Неуспешно създаване на съставка",
        variant: "destructive",
      })
    },
  })
}

export function useUpdateIngredient() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateIngredientDto }) =>
      ingredientsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] })
      toast({
        title: "Успех",
        description: "Съставката е обновена успешно",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Грешка",
        description: error.message || "Неуспешно обновяване на съставка",
        variant: "destructive",
      })
    },
  })
}

export function useDeleteIngredient() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (id: number) => ingredientsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] })
      toast({
        title: "Успех",
        description: "Съставката е изтрита успешно",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Грешка",
        description: error.message || "Неуспешно изтриване на съставка",
        variant: "destructive",
      })
    },
  })
}

