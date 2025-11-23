import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { recipesService } from "@/services/recipes.service"
import type {
  CreateUpdateRecipeDto,
  AddOrUpdateRecipeIngredientDto,
} from "@/types/recipe"
import { useToast } from "@/hooks/use-toast"

export function useRecipes() {
  return useQuery({
    queryKey: ["recipes"],
    queryFn: () => recipesService.getAll(),
  })
}

export function useRecipe(id: number) {
  return useQuery({
    queryKey: ["recipes", id],
    queryFn: () => recipesService.getById(id),
    enabled: !!id,
  })
}

export function useRecipeIngredients(recipeId: number) {
  return useQuery({
    queryKey: ["recipes", recipeId, "ingredients"],
    queryFn: () => recipesService.getIngredients(recipeId),
    enabled: !!recipeId,
  })
}

export function useCreateRecipe() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: CreateUpdateRecipeDto) => recipesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] })
      toast({
        title: "Успех",
        description: "Рецептата е създадена успешно",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Грешка",
        description: error.message || "Неуспешно създаване на рецепта",
        variant: "destructive",
      })
    },
  })
}

export function useUpdateRecipe() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateUpdateRecipeDto }) =>
      recipesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] })
      toast({
        title: "Успех",
        description: "Рецептата е обновена успешно",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Грешка",
        description: error.message || "Неуспешно обновяване на рецепта",
        variant: "destructive",
      })
    },
  })
}

export function useDeleteRecipe() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (id: number) => recipesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] })
      toast({
        title: "Успех",
        description: "Рецептата е изтрита успешно",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Грешка",
        description: error.message || "Неуспешно изтриване на рецепта",
        variant: "destructive",
      })
    },
  })
}

export function useAddRecipeIngredient() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({
      recipeId,
      data,
    }: {
      recipeId: number
      data: AddOrUpdateRecipeIngredientDto
    }) => recipesService.addIngredient(recipeId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["recipes", variables.recipeId, "ingredients"],
      })
      toast({
        title: "Успех",
        description: "Съставката е добавена успешно",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Грешка",
        description: error.message || "Неуспешно добавяне на съставка",
        variant: "destructive",
      })
    },
  })
}

export function useRemoveRecipeIngredient() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({
      recipeId,
      ingredientId,
    }: {
      recipeId: number
      ingredientId: number
    }) => recipesService.removeIngredient(recipeId, ingredientId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["recipes", variables.recipeId, "ingredients"],
      })
      toast({
        title: "Успех",
        description: "Съставката е премахната успешно",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Грешка",
        description: error.message || "Неуспешно премахване на съставка",
        variant: "destructive",
      })
    },
  })
}

