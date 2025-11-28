import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import type { MealPlanDto, MealPlanRecipeDto } from '@/types'
import { format } from 'date-fns'
import { bg } from 'date-fns/locale/bg'

const DAYS_OF_WEEK = [
  'Понеделник',
  'Вторник',
  'Сряда',
  'Четвъртък',
  'Петък',
  'Събота',
  'Неделя',
]

const MEAL_TYPES = ['Закуска', 'Обяд', 'Вечеря', 'Снакс']

export async function exportMealPlanToPDF(
  mealPlan: MealPlanDto,
  recipes: MealPlanRecipeDto[]
): Promise<void> {
  const dateRange = `${format(new Date(mealPlan.startDate), 'dd MMM yyyy', { locale: bg })} - ${format(new Date(mealPlan.endDate), 'dd MMM yyyy', { locale: bg })}`

  // Създаване на HTML структура
  const printContainer = document.createElement('div')
  printContainer.style.position = 'absolute'
  printContainer.style.left = '-9999px'
  printContainer.style.width = '297mm'
  printContainer.style.padding = '20mm'
  printContainer.style.fontFamily = 'Arial, sans-serif'
  printContainer.style.backgroundColor = 'white'
  printContainer.style.color = 'black'
  printContainer.style.fontSize = '14px'

  // Заглавие
  const title = document.createElement('h1')
  title.textContent = mealPlan.name
  title.style.fontSize = '24px'
  title.style.fontWeight = 'bold'
  title.style.textAlign = 'center'
  title.style.marginBottom = '10px'
  printContainer.appendChild(title)

  // Дати
  const dates = document.createElement('p')
  dates.textContent = dateRange
  dates.style.fontSize = '14px'
  dates.style.textAlign = 'center'
  dates.style.marginBottom = '20px'
  dates.style.color = '#666'
  printContainer.appendChild(dates)

  // Създаване на таблица
  const table = document.createElement('table')
  table.style.width = '100%'
  table.style.borderCollapse = 'collapse'
  table.style.marginTop = '20px'
  table.style.fontSize = '12px'

  // Заглавен ред
  const thead = document.createElement('thead')
  const headerRow = document.createElement('tr')
  headerRow.style.backgroundColor = '#4285F4'
  headerRow.style.color = 'white'
  headerRow.style.fontWeight = 'bold'

  const headers = ['Ден', 'Закуска', 'Обяд', 'Вечеря', 'Снакс']
  headers.forEach((headerText) => {
    const th = document.createElement('th')
    th.textContent = headerText
    th.style.padding = '12px'
    th.style.border = '1px solid #ddd'
    th.style.textAlign = 'center'
    th.style.fontSize = '14px'
    headerRow.appendChild(th)
  })
  thead.appendChild(headerRow)
  table.appendChild(thead)

  // Тяло на таблицата
  const tbody = document.createElement('tbody')

  // За всеки ден от седмицата
  DAYS_OF_WEEK.forEach((day, uiDayIndex) => {
    const apiDayIndex = uiDayIndex === 6 ? 0 : uiDayIndex + 1
    const dayRecipes = recipes.filter((r) => r.dayOfWeek === apiDayIndex)

    const row = document.createElement('tr')
    row.style.backgroundColor = tbody.children.length % 2 === 0 ? '#f5f5f5' : 'white'

    // Ден (първа колона)
    const dayCell = document.createElement('td')
    dayCell.textContent = day
    dayCell.style.padding = '12px'
    dayCell.style.border = '1px solid #ddd'
    dayCell.style.textAlign = 'center'
    dayCell.style.fontWeight = 'bold'
    dayCell.style.width = '15%'
    dayCell.style.verticalAlign = 'top'
    row.appendChild(dayCell)

    // Закуска
    const breakfastCell = document.createElement('td')
    const breakfastRecipes = dayRecipes.filter((r) => r.mealType === 'Закуска')
    if (breakfastRecipes.length > 0) {
      breakfastCell.innerHTML = breakfastRecipes
        .map(
          (r) =>
            `<div style="margin-bottom: 8px;"><strong>${r.recipeName}</strong><br/><span style="color: #666; font-size: 11px;">${r.cookingTimeMinutes} мин</span></div>`
        )
        .join('')
    } else {
      breakfastCell.textContent = '-'
      breakfastCell.style.color = '#999'
      breakfastCell.style.fontStyle = 'italic'
    }
    breakfastCell.style.padding = '12px'
    breakfastCell.style.border = '1px solid #ddd'
    breakfastCell.style.textAlign = 'left'
    breakfastCell.style.width = '21.25%'
    breakfastCell.style.verticalAlign = 'top'
    row.appendChild(breakfastCell)

    // Обяд
    const lunchCell = document.createElement('td')
    const lunchRecipes = dayRecipes.filter((r) => r.mealType === 'Обяд')
    if (lunchRecipes.length > 0) {
      lunchCell.innerHTML = lunchRecipes
        .map(
          (r) =>
            `<div style="margin-bottom: 8px;"><strong>${r.recipeName}</strong><br/><span style="color: #666; font-size: 11px;">${r.cookingTimeMinutes} мин</span></div>`
        )
        .join('')
    } else {
      lunchCell.textContent = '-'
      lunchCell.style.color = '#999'
      lunchCell.style.fontStyle = 'italic'
    }
    lunchCell.style.padding = '12px'
    lunchCell.style.border = '1px solid #ddd'
    lunchCell.style.textAlign = 'left'
    lunchCell.style.width = '21.25%'
    lunchCell.style.verticalAlign = 'top'
    row.appendChild(lunchCell)

    // Вечеря
    const dinnerCell = document.createElement('td')
    const dinnerRecipes = dayRecipes.filter((r) => r.mealType === 'Вечеря')
    if (dinnerRecipes.length > 0) {
      dinnerCell.innerHTML = dinnerRecipes
        .map(
          (r) =>
            `<div style="margin-bottom: 8px;"><strong>${r.recipeName}</strong><br/><span style="color: #666; font-size: 11px;">${r.cookingTimeMinutes} мин</span></div>`
        )
        .join('')
    } else {
      dinnerCell.textContent = '-'
      dinnerCell.style.color = '#999'
      dinnerCell.style.fontStyle = 'italic'
    }
    dinnerCell.style.padding = '12px'
    dinnerCell.style.border = '1px solid #ddd'
    dinnerCell.style.textAlign = 'left'
    dinnerCell.style.width = '21.25%'
    dinnerCell.style.verticalAlign = 'top'
    row.appendChild(dinnerCell)

    // Снакс
    const snackCell = document.createElement('td')
    const snackRecipes = dayRecipes.filter((r) => r.mealType === 'Снакс')
    if (snackRecipes.length > 0) {
      snackCell.innerHTML = snackRecipes
        .map(
          (r) =>
            `<div style="margin-bottom: 8px;"><strong>${r.recipeName}</strong><br/><span style="color: #666; font-size: 11px;">${r.cookingTimeMinutes} мин</span></div>`
        )
        .join('')
    } else {
      snackCell.textContent = '-'
      snackCell.style.color = '#999'
      snackCell.style.fontStyle = 'italic'
    }
    snackCell.style.padding = '12px'
    snackCell.style.border = '1px solid #ddd'
    snackCell.style.textAlign = 'left'
    snackCell.style.width = '21.25%'
    snackCell.style.verticalAlign = 'top'
    row.appendChild(snackCell)

    tbody.appendChild(row)
  })

  table.appendChild(tbody)
  printContainer.appendChild(table)

  // Добавяне на контейнера към документа
  document.body.appendChild(printContainer)

  try {
    // Конвертиране на HTML в canvas
    const canvas = await html2canvas(printContainer, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: printContainer.scrollWidth,
      height: printContainer.scrollHeight,
    })

    // Създаване на PDF
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    })

    const imgWidth = 297
    const pageHeight = 210
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight

    let position = 0

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    // Запазване на PDF
    const fileName = `${mealPlan.name.replace(/[^a-z0-9а-я]/gi, '_')}_${format(new Date(), 'yyyy-MM-dd')}.pdf`
    pdf.save(fileName)
  } finally {
    // Премахване на контейнера
    document.body.removeChild(printContainer)
  }
}

