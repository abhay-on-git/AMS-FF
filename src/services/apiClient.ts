import axios from 'axios'
import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { store } from '@/store/store'
import { logout } from '@/store/authSlice'

// ─── Error classes ────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly fields: Record<string, string[]>,
  ) {
    super(message)
    this.name = 'ValidationError'
  }
}

// ─── Response / pagination shapes ────────────────────────────────────────────

export interface PaginationMeta {
  page:       number
  pageSize:   number
  total:      number
  totalPages: number
}

export interface ApiResponse<T> {
  data:      T
  message?:  string
  meta?:     PaginationMeta
}

// ─── Token-refresh queue ──────────────────────────────────────────────────────
// Queues concurrent requests that arrive while a refresh is already in-flight
// so we only call POST /auth/refresh once, then replay all waiting requests.

let isRefreshing = false
let refreshQueue: Array<{
  resolve: (token: string) => void
  reject:  (err: unknown)  => void
}> = []

function processQueue(err: unknown, token: string | null) {
  refreshQueue.forEach(({ resolve, reject }) =>
    err ? reject(err) : resolve(token as string),
  )
  refreshQueue = []
}

// ─── Axios instance ───────────────────────────────────────────────────────────

export const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1',
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
})

// ── Request interceptor — attach Bearer token ─────────────────────────────────

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = store.getState().auth.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ── Response interceptor — error normalisation ────────────────────────────────

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string; errors?: Record<string, string[]>; code?: string }>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    const status          = error.response?.status
    const responseData    = error.response?.data

    // ── 422 Validation error ──────────────────────────────────────────────────
    if (status === 422) {
      throw new ValidationError(
        responseData?.message ?? 'Validation failed',
        responseData?.errors  ?? {},
      )
    }

    // ── 401 Unauthorised — attempt one token refresh ──────────────────────────
    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Another refresh is already in-flight — queue this request
        return new Promise((resolve, reject) => {
          refreshQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`
              resolve(apiClient(originalRequest))
            },
            reject,
          })
        })
      }

      originalRequest._retry = true
      isRefreshing           = true

      try {
        const { data } = await axios.post<{ token: string }>(
          `${import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1'}/auth/refresh`,
          {},
          { headers: { Authorization: `Bearer ${store.getState().auth.token}` } },
        )
        const newToken = data.token

        // Persist refreshed token to Redux store
        store.dispatch({ type: 'auth/setCredentials', payload: {
          user:  store.getState().auth.user!,
          token: newToken,
        }})

        processQueue(null, newToken)
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        store.dispatch(logout())
        window.location.href = '/auth'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // ── All other errors ──────────────────────────────────────────────────────
    throw new ApiError(
      responseData?.message ?? error.message ?? 'An unexpected error occurred',
      status             ?? 0,
      responseData?.code,
    )
  },
)
