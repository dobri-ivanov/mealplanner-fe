// User DTOs
export interface UserDto {
  id: number
  username: string
  email: string
}

export interface CreateUpdateUserDto {
  username: string
  email: string
  password?: string
}

export interface LoginDto {
  username: string
  password: string
}

