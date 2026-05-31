import { z } from 'zod'

export const createUserSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'Max 50 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Max 50 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
  countryCode: z.string().min(1, 'Country code is required'),
  mobile: z
    .string()
    .min(7, 'Mobile must be at least 7 digits')
    .max(15, 'Max 15 digits')
    .regex(/^\d+$/, 'Digits only'),
  role: z.string().min(1, 'Role is required'),
  fieldOffice: z.string().min(1, 'Field office is required'),
  assignedLocations: z.array(z.string()).default([]),
})

export const editUserSchema = createUserSchema.extend({
  status: z.enum(['active', 'inactive', 'locked']),
})

export const resetPasswordSchema = z
  .object({
    method: z.enum(['manual', 'email-link', 'temp-password']),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
    forceChange: z.boolean().default(true),
    notifyUser: z.boolean().default(true),
    revokeOtherSessions: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    if (data.method === 'manual') {
      if (!data.newPassword || data.newPassword.length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['newPassword'],
          message: 'Password must be at least 8 characters',
        })
      }
      if (data.newPassword !== data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['confirmPassword'],
          message: 'Passwords do not match',
        })
      }
    }
  })

export type CreateUserFormData    = z.infer<typeof createUserSchema>
export type EditUserFormData      = z.infer<typeof editUserSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
