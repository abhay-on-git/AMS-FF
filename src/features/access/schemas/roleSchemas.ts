import { z } from 'zod'

export const createRoleSchema = z.object({
  name: z
    .string()
    .min(1, 'Role name is required')
    .max(80, 'Max 80 characters'),
  description: z.string().max(300, 'Max 300 characters').optional(),
  category: z.enum(['administrator', 'standard', 'auditor', 'approver', 'custom'], {
    required_error: 'Category is required',
  }),
})

export const editRoleSchema = createRoleSchema

export type CreateRoleFormData = z.infer<typeof createRoleSchema>
export type EditRoleFormData   = z.infer<typeof editRoleSchema>
