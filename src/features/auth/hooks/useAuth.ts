import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { useAppDispatch } from '@/store/hooks'
import { setCredentials, logout } from '@/store/authSlice'
import type { AuthStep } from '../types'
import {
  loginUser,
  sendOtp,
  verifyOtp,
  resendOtp as resendOtpService,
  resetPassword as resetPasswordService,
  SIMULATED_OTP,
} from '../services/authService'

export function useAuth() {
  const dispatch = useAppDispatch()
  const [step, setStep] = useState<AuthStep>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [forgotEmail, setForgotEmail] = useState('')
  const [resendTimer, setResendTimer] = useState(0)

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(t)
    }
  }, [resendTimer])

  const handleLogin = useCallback(async (email: string, password: string) => {
    setError('')
    setLoading(true)
    const result = await loginUser(email, password)
    setLoading(false)
    if (result.success && result.data) {
      toast.success('Login successful! Welcome back.')
      dispatch(setCredentials({ user: result.data.user, token: result.data.token }))
    } else {
      setError(result.error || 'Login failed.')
    }
  }, [dispatch])

  const handleForgotEmail = useCallback(async (email: string) => {
    setError('')
    setLoading(true)
    setForgotEmail(email)
    await sendOtp(email)
    setLoading(false)
    setResendTimer(60)
    toast.success(`OTP sent to ${email}`, {
      description: `For demo purposes, the OTP is: ${SIMULATED_OTP}`,
      duration: 8000,
    })
    setStep('forgot-otp')
  }, [])

  const handleVerifyOtp = useCallback(async (otp: string) => {
    setError('')
    setLoading(true)
    const result = await verifyOtp(otp)
    setLoading(false)
    if (result.success) {
      toast.success('OTP verified!')
      setStep('forgot-reset')
    } else {
      setError(result.error || 'Verification failed.')
    }
  }, [])

  const handleResendOtp = useCallback(async () => {
    if (resendTimer > 0) return
    await resendOtpService()
    setResendTimer(60)
    setError('')
    toast.success(`OTP resent to ${forgotEmail}`, {
      description: `For demo purposes, the OTP is: ${SIMULATED_OTP}`,
      duration: 8000,
    })
  }, [resendTimer, forgotEmail])

  const handleResetPassword = useCallback(async (newPassword: string) => {
    setError('')
    setLoading(true)
    const result = await resetPasswordService(newPassword)
    setLoading(false)
    if (result.success) {
      setStep('forgot-success')
      toast.success('Password reset!')
    } else {
      setError(result.error || 'Reset failed.')
    }
  }, [])

  const handleLogout = useCallback(() => {
    dispatch(logout())
  }, [dispatch])

  const resetToLogin = useCallback(() => {
    setStep('login')
    setError('')
    setForgotEmail('')
    setResendTimer(0)
  }, [])

  const goToForgot = useCallback(() => {
    setStep('forgot-email')
    setError('')
  }, [])

  const goBackToForgotEmail = useCallback(() => {
    setStep('forgot-email')
    setError('')
  }, [])

  return {
    step,
    loading,
    error,
    forgotEmail,
    resendTimer,
    handleLogin,
    handleForgotEmail,
    handleVerifyOtp,
    handleResendOtp,
    handleResetPassword,
    handleLogout,
    resetToLogin,
    goToForgot,
    goBackToForgotEmail,
  }
}
