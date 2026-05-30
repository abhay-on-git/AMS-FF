import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Please enter both email and password.')
    .email('Please enter a valid email address.'),
  password: z
    .string()
    .min(1, 'Please enter both email and password.')
    .min(4, 'Password must be at least 4 characters.'),
})

export const forgotEmailSchema = z.object({
  email: z
    .string()
    .min(1, 'Please enter a valid email address.')
    .email('Please enter a valid email address.'),
})

export const otpSchema = z.object({
  otp: z
    .string()
    .length(4, 'Please enter the complete 4-digit OTP.')
    .regex(/^\d{4}$/, 'OTP must be 4 digits.'),
})

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters.'),
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

export type LoginFormData = z.infer<typeof loginSchema>
export type ForgotEmailFormData = z.infer<typeof forgotEmailSchema>
export type OtpFormData = z.infer<typeof otpSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
