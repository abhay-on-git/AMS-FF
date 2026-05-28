export type AuthStep =
  | 'login'
  | 'forgot-email'
  | 'forgot-otp'
  | 'forgot-reset'
  | 'forgot-success'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: string
}

export interface LoginResponse {
  user: AuthUser
  token: string
}

export interface AuthServiceResult<T = void> {
  success: boolean
  data?: T
  error?: string
}
