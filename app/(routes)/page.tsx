'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ChefHat, Calendar, Apple, Users, ArrowRight, Sparkles, CheckCircle2, Clock, BookOpen, TrendingUp, Heart, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
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

const features = [
  {
    icon: ChefHat,
    title: 'Управление на рецепти',
    description: 'Създавайте и организирайте вашите любими рецепти с лекота',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
  {
    icon: Apple,
    title: 'Съставки и категории',
    description: 'Организирайте съставките си по категории за по-лесно управление',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
  {
    icon: Calendar,
    title: 'Седмични планове',
    description: 'Планирайте храненето си за цялата седмица предварително',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    icon: Users,
    title: 'Персонализирано',
    description: 'Всеки потребител има свой профил и персонални настройки',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
]

const benefits = [
  {
    icon: Clock,
    title: 'Спестете време',
    description: 'Планирайте храненето си за цялата седмица и спестете часове всеки ден',
  },
  {
    icon: TrendingUp,
    title: 'Подобрете здравето',
    description: 'Следвайте балансиран режим на хранене с разнообразни и полезни ястия',
  },
  {
    icon: Heart,
    title: 'Насладете се на храната',
    description: 'Открийте нови рецепти и разнообразете менюто си всеки ден',
  },
  {
    icon: Shield,
    title: 'Безопасно и сигурно',
    description: 'Вашите данни са защитени и достъпни само за вас',
  },
]

const steps = [
  {
    number: '1',
    title: 'Регистрирайте се',
    description: 'Създайте безплатен акаунт за няколко секунди',
  },
  {
    number: '2',
    title: 'Добавете рецепти',
    description: 'Започнете да добавяте вашите любими рецепти и съставки',
  },
  {
    number: '3',
    title: 'Създайте план',
    description: 'Планирайте храненето си за седмицата с няколко клика',
  },
  {
    number: '4',
    title: 'Насладете се',
    description: 'Следвайте плана и насладете се на разнообразно и вкусно хранене',
  },
]

const stats = [
  { value: '1000+', label: 'Активни потребители' },
  { value: '5000+', label: 'Рецепти в базата' },
  { value: '98%', label: 'Доволни клиенти' },
  { value: '24/7', label: 'Достъпност' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center space-y-8"
        >
          <motion.div variants={itemVariants} className="space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary"
            >
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Модерно планиране на хранене</span>
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Добре дошли в{' '}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                MealPlanner
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Модерна платформа за планиране на хранене. Създавайте рецепти, управлявайте
              съставки и планирайте седмични режими за хранене.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="gap-2">
                Започнете сега
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                Влезте
              </Button>
            </Link>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Защо MealPlanner?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Платформата ви дава всички инструменти, от които се нуждаете за организирано
            планиране на хранене
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="h-full cursor-pointer transition-all hover:shadow-lg">
                  <CardHeader>
                    <Icon className={`h-10 w-10 ${feature.color} mb-2`} />
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Предимства</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Открийте как MealPlanner може да подобри ежедневието ви
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{benefit.title}</CardTitle>
                      <CardDescription className="text-base">
                        {benefit.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Как работи?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Започнете да използвате MealPlanner само с няколко прости стъпки
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">
                  {step.number}
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-border -z-10" />
                )}
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Visual Showcase Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-purple-500/10 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Всичко на едно място
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                MealPlanner ви дава пълен контрол над храненето си. От създаване на рецепти до
                планиране на седмични менюта - всичко е на разположение в един модерен и лесен за
                използване интерфейс.
              </p>
              <ul className="space-y-4">
                {[
                  'Управление на рецепти с инструкции и съставки',
                  'Организация на съставки по категории',
                  'Седмично планиране на хранене',
                  'Персонализирани профили и настройки',
                  'Модерен и интуитивен интерфейс',
                  'Достъп от всяко устройство',
                ].map((item, index) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-6 bg-background/80 backdrop-blur">
                  <ChefHat className="h-12 w-12 text-orange-500 mb-4" />
                  <h3 className="font-semibold mb-2">Рецепти</h3>
                  <p className="text-sm text-muted-foreground">
                    Създавайте и управлявайте вашите любими рецепти
                  </p>
                </Card>
                <Card className="p-6 bg-background/80 backdrop-blur">
                  <Calendar className="h-12 w-12 text-purple-500 mb-4" />
                  <h3 className="font-semibold mb-2">Планове</h3>
                  <p className="text-sm text-muted-foreground">
                    Планирайте храненето си за цялата седмица
                  </p>
                </Card>
                <Card className="p-6 bg-background/80 backdrop-blur">
                  <Apple className="h-12 w-12 text-red-500 mb-4" />
                  <h3 className="font-semibold mb-2">Съставки</h3>
                  <p className="text-sm text-muted-foreground">
                    Организирайте съставките си по категории
                  </p>
                </Card>
                <Card className="p-6 bg-background/80 backdrop-blur">
                  <BookOpen className="h-12 w-12 text-blue-500 mb-4" />
                  <h3 className="font-semibold mb-2">Категории</h3>
                  <p className="text-sm text-muted-foreground">
                    Групирайте рецептите си по категории
                  </p>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6"
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            Готови ли сте да започнете?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Регистрирайте се безплатно и започнете да планирате храненето си днес. Няма нужда от
            кредитна карта, няма скрити такси - само инструменти, които ви помагат да ядете по-добре.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="gap-2">
                Създайте акаунт
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                Вече имате акаунт?
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
