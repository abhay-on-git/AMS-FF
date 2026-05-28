import { z } from 'zod'

export const editAssetSchema = z.object({
  name: z.string().min(1, 'Asset name is required'),
  type: z.string().min(1, 'Asset type is required'),
  category: z.string().optional(),
  serialNumber: z.string().optional(),
  condition: z.string().optional(),
})

export type EditAssetFormData = z.infer<typeof editAssetSchema>

export const changeStatusSchema = z.object({
  targetStage: z.string().min(1, 'Please select a target stage'),
  justification: z.string().min(1, 'Justification is required for all status changes'),
})

export type ChangeStatusFormData = z.infer<typeof changeStatusSchema>

export const changeLocationSchema = z.object({
  newLocation: z.string().min(1, 'Please select a new location'),
  fieldOffice: z.string().optional(),
  justification: z.string().min(1, 'Justification is required'),
})

export type ChangeLocationFormData = z.infer<typeof changeLocationSchema>

export const transferAssetSchema = z.object({
  destination: z.string().min(1, 'Please select a destination'),
  custodian: z.string().min(1, 'Please select a receiving custodian'),
  justification: z.string().min(1, 'Justification is required'),
})

export type TransferAssetFormData = z.infer<typeof transferAssetSchema>
