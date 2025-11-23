"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { RecipeDto, CreateUpdateRecipeDto } from "@/types/recipe"
import { useCategories } from "@/hooks/use-categories"
import { useUsers } from "@/hooks/use-users"

const recipeSchema = z.object({
  name: z.string().min(1, "Името е задължително"),
  instructions: z.string().min(1, "Инструкциите са задължителни"),
  cookingTimeMinutes: z
    .number()
    .min(1, "Времето за готвене трябва да е поне 1 минута"),
  categoryId: z.number().min(1, "Категорията е задължителна"),
  authorUserId: z.number().min(1, "Авторът е задължителен"),
})

type RecipeFormData = z.infer<typeof recipeSchema>

interface RecipeFormProps {
  recipe?: RecipeDto
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateUpdateRecipeDto) => void
  isLoading?: boolean
}

export function RecipeForm({
  recipe,
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: RecipeFormProps) {
  const { data: categories } = useCategories()
  const { data: users } = useUsers()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<RecipeFormData>({
    resolver: zodResolver(recipeSchema),
    defaultValues: recipe
      ? {
          name: recipe.name,
          instructions: recipe.instructions,
          cookingTimeMinutes: recipe.cookingTimeMinutes,
          categoryId: recipe.categoryId,
          authorUserId: recipe.authorUserId,
        }
      : {
          name: "",
          instructions: "",
          cookingTimeMinutes: 30,
          categoryId: 0,
          authorUserId: 0,
        },
  })

  const categoryId = watch("categoryId")
  const authorUserId = watch("authorUserId")

  const onFormSubmit = (data: RecipeFormData) => {
    onSubmit(data)
    if (!isLoading) {
      reset()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {recipe ? "Редактиране на рецепта" : "Създаване на рецепта"}
          </DialogTitle>
          <DialogDescription>
            {recipe
              ? "Променете информацията за рецептата"
              : "Добавете нова рецепта в системата"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Име</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Въведете име на рецептата"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="instructions">Инструкции</Label>
              <textarea
                id="instructions"
                {...register("instructions")}
                placeholder="Въведете инструкции за приготвяне"
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              {errors.instructions && (
                <p className="text-sm text-destructive">
                  {errors.instructions.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cookingTimeMinutes">
                  Време за готвене (минути)
                </Label>
                <Input
                  id="cookingTimeMinutes"
                  type="number"
                  {...register("cookingTimeMinutes", { valueAsNumber: true })}
                  placeholder="30"
                />
                {errors.cookingTimeMinutes && (
                  <p className="text-sm text-destructive">
                    {errors.cookingTimeMinutes.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoryId">Категория</Label>
                <Select
                  value={categoryId?.toString() || ""}
                  onValueChange={(value) =>
                    setValue("categoryId", parseInt(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Изберете категория" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categoryId && (
                  <p className="text-sm text-destructive">
                    {errors.categoryId.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="authorUserId">Автор</Label>
              <Select
                value={authorUserId?.toString() || ""}
                onValueChange={(value) =>
                  setValue("authorUserId", parseInt(value))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Изберете автор" />
                </SelectTrigger>
                <SelectContent>
                  {users?.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.authorUserId && (
                <p className="text-sm text-destructive">
                  {errors.authorUserId.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Отказ
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Зареждане..." : recipe ? "Запази" : "Създай"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

