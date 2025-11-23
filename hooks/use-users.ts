import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { usersService } from "@/services/users.service"
import type { CreateUpdateUserDto } from "@/types/user"
import { useToast } from "@/hooks/use-toast"

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => usersService.getAll(),
  })
}

export function useUser(id: number) {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => usersService.getById(id),
    enabled: !!id,
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: CreateUpdateUserDto) => usersService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast({
        title: "Успех",
        description: "Потребителят е създаден успешно",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Грешка",
        description: error.message || "Неуспешно създаване на потребител",
        variant: "destructive",
      })
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateUpdateUserDto }) =>
      usersService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast({
        title: "Успех",
        description: "Потребителят е обновен успешно",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Грешка",
        description: error.message || "Неуспешно обновяване на потребител",
        variant: "destructive",
      })
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (id: number) => usersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast({
        title: "Успех",
        description: "Потребителят е изтрит успешно",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Грешка",
        description: error.message || "Неуспешно изтриване на потребител",
        variant: "destructive",
      })
    },
  })
}

