# MealPlanner Frontend

Модерно Next.js приложение за планиране на хранене с интеграция към MealPlanner Web API.

## Технологии

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** компоненти
- **Framer Motion** за анимации
- **React Query** за управление на API заявки
- **React Hook Form + Zod** за валидация
- **Zustand** за глобално състояние

## Структура на проекта

```
/app
  /(routes)          # Страници
    /users
    /categories
    /ingredients
    /recipes
    /mealplans
/components          # UI компоненти
  /ui                # shadcn/ui компоненти
/services            # API заявки
/types               # TypeScript типове (DTO)
/lib                 # Утилити
/hooks               # Custom hooks
```

## Инсталация

```bash
npm install
```

## Конфигурация

Създайте `.env.local` файл:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Стартиране

```bash
npm run dev
```

Приложението ще стартира на `http://localhost:3000`

## Функционалности

- ✅ Управление на потребители (CRUD)
- ✅ Управление на категории (CRUD)
- ✅ Управление на съставки (CRUD)
- ✅ Управление на рецепти (CRUD)
- ✅ Управление на планове за хранене (CRUD)
- ✅ Тъмна и светла тема
- ✅ Плавни анимации с Framer Motion
- ✅ Пълна валидация на форми
- ✅ Toast уведомления
- ✅ Loading състояния

## Език

Всички текстове в интерфейса са на български език.

