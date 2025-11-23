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
import type { UserDto, CreateUpdateUserDto } from "@/types/user"

const userSchema = z.object({
  username: z.string().min(1, "Потребителското име е задължително"),
  email: z.string().email("Невалиден имейл адрес"),
  password: z.string().optional(),
})

type UserFormData = z.infer<typeof userSchema>

interface UserFormProps {
  user?: UserDto
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateUpdateUserDto) => void
  isLoading?: boolean
}

export function UserForm({
  user,
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: UserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: user
      ? {
          username: user.username,
          email: user.email,
          password: "",
        }
      : {
          username: "",
          email: "",
          password: "",
        },
  })

  const onFormSubmit = (data: UserFormData) => {
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
            {user ? "Редактиране на потребител" : "Създаване на потребител"}
          </DialogTitle>
          <DialogDescription>
            {user
              ? "Променете информацията за потребителя"
              : "Добавете нов потребител в системата"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="username">Потребителско име</Label>
              <Input
                id="username"
                {...register("username")}
                placeholder="Въведете потребителско име"
              />
              {errors.username && (
                <p className="text-sm text-destructive">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Имейл</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="Въведете имейл адрес"
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">
                Парола {user && "(оставете празно за запазване)"}
              </Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                placeholder="Въведете парола"
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
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
              {isLoading ? "Зареждане..." : user ? "Запази" : "Създай"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

