import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { mealplansService } from "@/services/mealplans.service"
import type {
  CreateUpdateMealPlanDto,
  AddOrUpdateMealPlanRecipeDto,
} from "@/types/mealplan"
import { useToast } from "@/hooks/use-toast"

export function useMealPlans() {
  return useQuery({
    queryKey: ["mealplans"],
    queryFn: () => mealplansService.getAll(),
  })
}

export function useMealPlan(id: number) {
  return useQuery({
    queryKey: ["mealplans", id],
    queryFn: () => mealplansService.getById(id),
    enabled: !!id,
  })
}

export function useMealPlanRecipes(mealPlanId: number) {
  return useQuery({
    queryKey: ["mealplans", mealPlanId, "recipes"],
    queryFn: () => mealplansService.getRecipes(mealPlanId),
    enabled: !!mealPlanId,
  })
}

export function useCreateMealPlan() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: CreateUpdateMealPlanDto) =>
      mealplansService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mealplans"] })
      toast({
        title: "Успех",
        description: "Планът е създаден успешно",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Грешка",
        description: error.message || "Неуспешно създаване на план",
        variant: "destructive",
      })
    },
  })
}

export function useUpdateMealPlan() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: CreateUpdateMealPlanDto
    }) => mealplansService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mealplans"] })
      toast({
        title: "Успех",
        description: "Планът е обновен успешно",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Грешка",
        description: error.message || "Неуспешно обновяване на план",
        variant: "destructive",
      })
    },
  })
}

export function useDeleteMealPlan() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (id: number) => mealplansService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mealplans"] })
      toast({
        title: "Успех",
        description: "Планът е изтрит успешно",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Грешка",
        description: error.message || "Неуспешно изтриване на план",
        variant: "destructive",
      })
    },
  })
}

export function useAddMealPlanRecipe() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({
      mealPlanId,
      data,
    }: {
      mealPlanId: number
      data: AddOrUpdateMealPlanRecipeDto
    }) => mealplansService.addRecipe(mealPlanId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["mealplans", variables.mealPlanId, "recipes"],
      })
      toast({
        title: "Успех",
        description: "Рецептата е добавена успешно",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Грешка",
        description: error.message || "Неуспешно добавяне на рецепта",
        variant: "destructive",
      })
    },
  })
}

export function useRemoveMealPlanRecipe() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({
      mealPlanId,
      recipeId,
      dayOfWeek,
      mealType,
    }: {
      mealPlanId: number
      recipeId: number
      dayOfWeek: number
      mealType: string
    }) =>
      mealplansService.removeRecipe(mealPlanId, recipeId, dayOfWeek, mealType),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["mealplans", variables.mealPlanId, "recipes"],
      })
      toast({
        title: "Успех",
        description: "Рецептата е премахната успешно",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Грешка",
        description: error.message || "Неуспешно премахване на рецепта",
        variant: "destructive",
      })
    },
  })
}

