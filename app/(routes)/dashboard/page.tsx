'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Tag, Apple, ChefHat, Calendar, ArrowRight } from 'lucide-react'
import { ProtectedRoute } from '@/components/protected-route'
import { useAuthStore } from '@/lib/auth-store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

const modules = [
  {
    title: 'Категории',
    description: 'Управлявайте категориите на вашите рецепти и съставки',
    icon: Tag,
    href: '/categories',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    title: 'Съставки',
    description: 'Добавяйте и управлявайте съставките, които използвате в рецептите',
    icon: Apple,
    href: '/ingredients',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
  {
    title: 'Рецепти',
    description: 'Създавайте и редактирайте рецепти с инструкции и съставки',
    icon: ChefHat,
    href: '/recipes',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
  {
    title: 'Планове за хранене',
    description: 'Планирайте седмични режими за хранене с вашите рецепти',
    icon: Calendar,
    href: '/mealplans',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
]

export default function DashboardPage() {
  const { user } = useAuthStore()

  return (
    <ProtectedRoute>
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={itemVariants} className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          Добре дошли, {user?.username}!
        </h1>
        <p className="text-xl text-muted-foreground">
          Управлявайте вашите рецепти, съставки и планове за хранене
        </p>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
      >
        {modules.map((module) => {
          const Icon = module.icon
          return (
            <motion.div
              key={module.href}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href={module.href}>
                <Card className="h-full cursor-pointer transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-lg ${module.bgColor} mb-4`}>
                        <Icon className={`h-6 w-6 ${module.color}`} />
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-xl">{module.title}</CardTitle>
                    <CardDescription className="text-base">
                      {module.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </motion.div>
          )
        })}
      </motion.div>
    </motion.div>
    </ProtectedRoute>
  )
}

