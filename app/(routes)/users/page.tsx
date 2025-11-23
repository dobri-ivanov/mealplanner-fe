"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { UserForm } from "@/components/users/user-form"
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "@/hooks/use-users"
import type { UserDto, CreateUpdateUserDto } from "@/types/user"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
}

export default function UsersPage() {
  const { data: users, isLoading } = useUsers()
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const deleteUser = useDeleteUser()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserDto | undefined>()
  const [deletingUser, setDeletingUser] = useState<UserDto | undefined>()

  const handleCreate = () => {
    setEditingUser(undefined)
    setIsFormOpen(true)
  }

  const handleEdit = (user: UserDto) => {
    setEditingUser(user)
    setIsFormOpen(true)
  }

  const handleDelete = (user: UserDto) => {
    setDeletingUser(user)
  }

  const handleFormSubmit = (data: CreateUpdateUserDto) => {
    if (editingUser) {
      updateUser.mutate(
        { id: editingUser.id, data },
        {
          onSuccess: () => {
            setIsFormOpen(false)
            setEditingUser(undefined)
          },
        }
      )
    } else {
      createUser.mutate(data, {
        onSuccess: () => {
          setIsFormOpen(false)
        },
      })
    }
  }

  const handleConfirmDelete = () => {
    if (deletingUser) {
      deleteUser.mutate(deletingUser.id, {
        onSuccess: () => {
          setDeletingUser(undefined)
        },
      })
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Потребители</h1>
          <p className="text-muted-foreground">
            Управление на потребители в системата
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Добави потребител
          </Button>
        </motion.div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {users?.map((user) => (
            <motion.div key={user.id} variants={itemVariants}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{user.username}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {user.email}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(user)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Редактирай
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(user)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Изтрий
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {users?.length === 0 && !isLoading && (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">
              Няма потребители. Създайте първия потребител.
            </p>
          </CardContent>
        </Card>
      )}

      <UserForm
        user={editingUser}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
        isLoading={createUser.isPending || updateUser.isPending}
      />

      <AlertDialog
        open={!!deletingUser}
        onOpenChange={(open) => !open && setDeletingUser(undefined)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Потвърждение за изтриване</AlertDialogTitle>
            <AlertDialogDescription>
              Сигурни ли сте, че искате да изтриете потребителя{" "}
              <strong>{deletingUser?.username}</strong>? Това действие не може
              да бъде отменено.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отказ</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Изтрий
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  )
}

