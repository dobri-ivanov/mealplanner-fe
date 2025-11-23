// Category DTOs
export interface CategoryDto {
  id: number
  name: string
  description?: string
}

export interface CreateUpdateCategoryDto {
  name: string
  description?: string
}

export interface UpdateCategoryDto {
  name?: string
  description?: string
}

