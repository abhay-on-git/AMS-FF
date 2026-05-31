import { z } from 'zod'

export const categorySchema = z.object({
  categoryName: z.string().min(1, 'Category name is required'),
  description:  z.string().optional(),
  status:       z.enum(['active', 'inactive']),
})

export type CategoryFormData = z.infer<typeof categorySchema>
