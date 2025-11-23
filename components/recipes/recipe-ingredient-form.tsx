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
import type { AddOrUpdateRecipeIngredientDto } from "@/types/recipe"
import { useIngredients } from "@/hooks/use-ingredients"

const ingredientSchema = z.object({
  ingredientId: z.number().min(1, "Съставката е задължителна"),
  quantity: z.number().min(0.1, "Количеството трябва да е поне 0.1"),
})

type IngredientFormData = z.infer<typeof ingredientSchema>

interface RecipeIngredientFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: AddOrUpdateRecipeIngredientDto) => void
  isLoading?: boolean
}

export function RecipeIngredientForm({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: RecipeIngredientFormProps) {
  const { data: ingredients } = useIngredients()

  const {
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<IngredientFormData>({
    resolver: zodResolver(ingredientSchema),
    defaultValues: {
      ingredientId: 0,
      quantity: 1,
    },
  })

  const ingredientId = watch("ingredientId")

  const onFormSubmit = (data: IngredientFormData) => {
    onSubmit({
      ingredientId: data.ingredientId,
      quantity: data.quantity,
    })
    if (!isLoading) {
      reset()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Добави съставка</DialogTitle>
          <DialogDescription>
            Добавете съставка към рецептата с количество
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="ingredientId">Съставка</Label>
              <Select
                value={ingredientId?.toString() || ""}
                onValueChange={(value) =>
                  setValue("ingredientId", parseInt(value))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Изберете съставка" />
                </SelectTrigger>
                <SelectContent>
                  {ingredients?.map((ingredient) => (
                    <SelectItem
                      key={ingredient.id}
                      value={ingredient.id.toString()}
                    >
                      {ingredient.name} ({ingredient.unit})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.ingredientId && (
                <p className="text-sm text-destructive">
                  {errors.ingredientId.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Количество</Label>
              <Input
                id="quantity"
                type="number"
                step="0.1"
                {...watch("quantity")}
                onChange={(e) =>
                  setValue("quantity", parseFloat(e.target.value) || 0)
                }
                placeholder="1.0"
              />
              {errors.quantity && (
                <p className="text-sm text-destructive">
                  {errors.quantity.message}
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
              {isLoading ? "Зареждане..." : "Добави"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

