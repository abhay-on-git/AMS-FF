import { apiClient } from '@/services/apiClient'
import { IS_MOCK } from '@/services/mockMode'
import type { AuthServiceResult, LoginResponse } from '../types'

// ─── Mock helpers ─────────────────────────────────────────────────────────────

const SIMULATED_OTP = '1234'

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

// ─── loginUser ────────────────────────────────────────────────────────────────
// POST /auth/login   →   { user: AuthUser, token: string }

export async function loginUser(
  email:    string,
  password: string,
): Promise<AuthServiceResult<LoginResponse>> {
  if (IS_MOCK) {
    await delay(1500)
    if (email && password.length >= 4) {
      return {
        success: true,
        data: {
          user:  { id: '1', email, name: email.split('@')[0], role: 'admin' },
          token: 'simulated-jwt-token',
        },
      }
    }
    return { success: false, error: 'Invalid credentials. Password must be at least 4 characters.' }
  }

  try {
    const { data } = await apiClient.post<LoginResponse>('/auth/login', { email, password })
    return { success: true, data }
  } catch (err: unknown) {
    return { success: false, error: extractMessage(err) }
  }
}

// ─── sendOtp ──────────────────────────────────────────────────────────────────
// POST /auth/forgot-password   →   204

export async function sendOtp(email: string): Promise<AuthServiceResult> {
  if (IS_MOCK) {
    await delay(1200)
    return { success: true }
  }

  try {
    await apiClient.post('/auth/forgot-password', { email })
    return { success: true }
  } catch (err: unknown) {
    return { success: false, error: extractMessage(err) }
  }
}

// ─── verifyOtp ────────────────────────────────────────────────────────────────
// POST /auth/verify-otp   →   204

export async function verifyOtp(otp: string): Promise<AuthServiceResult> {
  if (IS_MOCK) {
    await delay(1000)
    if (otp === SIMULATED_OTP) return { success: true }
    return { success: false, error: 'Invalid OTP. Please try again.' }
  }

  try {
    await apiClient.post('/auth/verify-otp', { otp })
    return { success: true }
  } catch (err: unknown) {
    return { success: false, error: extractMessage(err) }
  }
}

// ─── resendOtp ────────────────────────────────────────────────────────────────
// POST /auth/resend-otp   →   204

export async function resendOtp(): Promise<AuthServiceResult> {
  if (IS_MOCK) {
    return { success: true }
  }

  try {
    await apiClient.post('/auth/resend-otp')
    return { success: true }
  } catch (err: unknown) {
    return { success: false, error: extractMessage(err) }
  }
}

// ─── resetPassword ────────────────────────────────────────────────────────────
// POST /auth/reset-password   →   204

export async function resetPassword(newPassword: string): Promise<AuthServiceResult> {
  if (IS_MOCK) {
    await delay(1200)
    if (newPassword.length >= 8) return { success: true }
    return { success: false, error: 'Password must be at least 8 characters.' }
  }

  try {
    await apiClient.post('/auth/reset-password', { password: newPassword })
    return { success: true }
  } catch (err: unknown) {
    return { success: false, error: extractMessage(err) }
  }
}

// ─── refreshToken ─────────────────────────────────────────────────────────────
// POST /auth/refresh   →   { token: string }
// Called by apiClient's 401 interceptor — rarely needed directly.

export async function refreshToken(): Promise<AuthServiceResult<{ token: string }>> {
  if (IS_MOCK) {
    return { success: true, data: { token: 'simulated-jwt-token' } }
  }

  try {
    const { data } = await apiClient.post<{ token: string }>('/auth/refresh')
    return { success: true, data }
  } catch (err: unknown) {
    return { success: false, error: extractMessage(err) }
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  return 'An unexpected error occurred'
}

export { SIMULATED_OTP }
