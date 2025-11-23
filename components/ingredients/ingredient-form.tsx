"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type {
  IngredientDto,
  CreateIngredientDto,
  UpdateIngredientDto,
} from "@/types/ingredient"

const ingredientSchema = z.object({
  name: z.string().min(1, "Името е задължително"),
  unit: z.string().min(1, "Мерната единица е задължителна"),
})

type IngredientFormData = z.infer<typeof ingredientSchema>

interface IngredientFormProps {
  ingredient?: IngredientDto
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateIngredientDto | UpdateIngredientDto) => void
  isLoading?: boolean
}

export function IngredientForm({
  ingredient,
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: IngredientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IngredientFormData>({
    resolver: zodResolver(ingredientSchema),
    defaultValues: ingredient
      ? {
          name: ingredient.name,
          unit: ingredient.unit,
        }
      : {
          name: "",
          unit: "",
        },
  })

  const onFormSubmit = (data: IngredientFormData) => {
    onSubmit(data)
    if (!isLoading) {
      reset()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {ingredient
              ? "Редактиране на съставка"
              : "Създаване на съставка"}
          </DialogTitle>
          <DialogDescription>
            {ingredient
              ? "Променете информацията за съставката"
              : "Добавете нова съставка в системата"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Име</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Въведете име на съставката"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Мерна единица</Label>
              <Input
                id="unit"
                {...register("unit")}
                placeholder="Напр. кг, гр, бр, мл"
              />
              {errors.unit && (
                <p className="text-sm text-destructive">{errors.unit.message}</p>
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
              {isLoading ? "Зареждане..." : ingredient ? "Запази" : "Създай"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

