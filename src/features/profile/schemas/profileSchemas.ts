import { z } from 'zod'

export const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  phoneCountryCode: z.string().min(1, 'Country code is required'),
  phone: z.string().optional(),
  fieldOffice: z.string().min(1, 'Field office is required'),
  department: z.string().min(1, 'Department is required'),
})

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>
