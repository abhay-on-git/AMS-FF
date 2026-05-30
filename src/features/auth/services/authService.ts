import type { AuthServiceResult, LoginResponse } from '../types'

const SIMULATED_OTP = '1234'

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// TODO: Replace with real API call — POST /api/auth/login
export async function loginUser(
  email: string,
  password: string,
): Promise<AuthServiceResult<LoginResponse>> {
  await delay(1500)
  if (email && password.length >= 4) {
    return {
      success: true,
      data: {
        user: {
          id: '1',
          email,
          name: email.split('@')[0],
          role: 'admin',
        },
        token: 'simulated-jwt-token',
      },
    }
  }
  return {
    success: false,
    error: 'Invalid credentials. Password must be at least 4 characters.',
  }
}

// TODO: Replace with real API call — POST /api/auth/forgot-password
export async function sendOtp(email: string): Promise<AuthServiceResult> {
  await delay(1200)
  return { success: true }
}

// TODO: Replace with real API call — POST /api/auth/verify-otp
export async function verifyOtp(otp: string): Promise<AuthServiceResult> {
  await delay(1000)
  if (otp === SIMULATED_OTP) {
    return { success: true }
  }
  return { success: false, error: 'Invalid OTP. Please try again.' }
}

// TODO: Replace with real API call — POST /api/auth/resend-otp
export async function resendOtp(): Promise<AuthServiceResult> {
  return { success: true }
}

// TODO: Replace with real API call — POST /api/auth/reset-password
export async function resetPassword(
  newPassword: string,
): Promise<AuthServiceResult> {
  await delay(1200)
  if (newPassword.length >= 8) {
    return { success: true }
  }
  return { success: false, error: 'Password must be at least 8 characters.' }
}

export { SIMULATED_OTP }
