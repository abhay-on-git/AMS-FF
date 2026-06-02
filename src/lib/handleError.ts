import { toast } from 'sonner'
import { ApiError, ValidationError as ApiValidationError } from '@/services/apiClient'
import {
  AppError,
  NetworkError,
  AuthError,
  ValidationError,
  NotFoundError,
  PermissionError,
} from './errors'

/**
 * Central error handler — maps every known error class to an appropriate
 * toast notification. Call this in mutation `onError` callbacks and
 * top-level try/catch blocks.
 *
 * Unknown errors (plain Error, unexpected throws) show a generic message
 * so nothing is ever silently swallowed.
 *
 * @example
 * mutation.mutate(data, { onError: handleError })
 *
 * @example
 * try { ... } catch (err) { handleError(err) }
 */
export function handleError(error: unknown): void {
  // ── lib/errors.ts hierarchy ───────────────────────────────────────────────

  if (error instanceof NetworkError) {
    toast.error(error.message)
    return
  }

  if (error instanceof AuthError) {
    toast.error(error.message)
    return
  }

  if (error instanceof ValidationError) {
    const fieldErrors = Object.values(error.fields).flat()
    if (fieldErrors.length > 0) {
      toast.error(fieldErrors[0])        // surface the first field error
    } else {
      toast.error(error.message)
    }
    return
  }

  if (error instanceof NotFoundError) {
    toast.error(error.message)
    return
  }

  if (error instanceof PermissionError) {
    toast.error(error.message)
    return
  }

  if (error instanceof AppError) {
    toast.error(error.message)
    return
  }

  // ── apiClient.ts error classes (may arrive before lib errors are resolved) ─

  if (error instanceof ApiValidationError) {
    const fieldErrors = Object.values(error.fields).flat()
    toast.error(fieldErrors[0] ?? error.message)
    return
  }

  if (error instanceof ApiError) {
    switch (error.status) {
      case 401:
        toast.error('Session expired — please log in again')
        break
      case 403:
        toast.error('You do not have permission to perform this action')
        break
      case 404:
        toast.error('The requested resource was not found')
        break
      case 429:
        toast.error('Too many requests — please wait a moment and try again')
        break
      case 500:
      case 502:
      case 503:
        toast.error('Server error — please try again later')
        break
      default:
        toast.error(error.message || 'An unexpected error occurred')
    }
    return
  }

  // ── Standard Error / unexpected throws ────────────────────────────────────

  if (error instanceof Error) {
    // Axios network errors (no response — offline / CORS / timeout)
    if (error.message === 'Network Error') {
      toast.error('Network error — please check your connection')
      return
    }
    if (error.message.startsWith('timeout')) {
      toast.error('Request timed out — please try again')
      return
    }
    toast.error(error.message)
    return
  }

  // ── Absolute fallback ─────────────────────────────────────────────────────
  toast.error('An unexpected error occurred')
}
