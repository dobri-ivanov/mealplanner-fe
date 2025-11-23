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
import type { CategoryDto, CreateUpdateCategoryDto } from "@/types/category"

const categorySchema = z.object({
  name: z.string().min(1, "Името е задължително"),
  description: z.string().optional(),
})

type CategoryFormData = z.infer<typeof categorySchema>

interface CategoryFormProps {
  category?: CategoryDto
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateUpdateCategoryDto) => void
  isLoading?: boolean
}

export function CategoryForm({
  category,
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: category
      ? {
          name: category.name,
          description: category.description || "",
        }
      : {
          name: "",
          description: "",
        },
  })

  const onFormSubmit = (data: CategoryFormData) => {
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
            {category ? "Редактиране на категория" : "Създаване на категория"}
          </DialogTitle>
          <DialogDescription>
            {category
              ? "Променете информацията за категорията"
              : "Добавете нова категория в системата"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Име</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Въведете име на категорията"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Input
                id="description"
                {...register("description")}
                placeholder="Въведете описание (незадължително)"
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
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
              {isLoading ? "Зареждане..." : category ? "Запази" : "Създай"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

