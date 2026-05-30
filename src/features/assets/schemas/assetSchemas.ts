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

export const createAssetSchema = z.object({
  assetId: z.string().min(1, 'Asset ID is required'),
  epc: z.string().min(1, 'EPC is required'),
  type: z.string().min(1, 'Type is required'),
  name: z.string().min(1, 'Name is required'),
  fieldOffice: z.string().min(1, 'Field Office is required'),
  location: z.string().min(1, 'Location is required'),
  barcode: z.string().optional(),
  description: z.string().optional(),
  responsiblePerson: z.string().optional(),
  serialNumber: z.string().optional(),
  condition: z.string().default('good'),
  status: z.string().default('active'),
  poNumber: z.string().optional(),
  grnNumber: z.string().optional(),
  supplier: z.string().optional(),
  acquisitionDate: z.string().optional(),
  quantity: z.string().default('1'),
  unitPrice: z.string().optional(),
  currency: z.string().default('USD'),
  totalValue: z.string().optional(),
  notes: z.string().optional(),
})

export type CreateAssetFormData = z.infer<typeof createAssetSchema>

export const bulkTransferSchema = z.object({
  destination: z.string().min(1, 'Destination is required'),
  custodian: z.string().min(1, 'Receiving custodian is required'),
  expectedDate: z.string().optional(),
  justification: z.string().min(10, 'Please provide at least 10 characters of justification'),
  notes: z.string().optional(),
})

export type BulkTransferFormData = z.infer<typeof bulkTransferSchema>

export const bulkInspectionSchema = z.object({
  inspectionType: z.string().min(1, 'Inspection type is required'),
  scheduledDate: z.string().min(1, 'Scheduled date is required'),
  inspector: z.string().min(1, 'Inspector is required'),
  location: z.string().min(1, 'Location is required'),
  notes: z.string().optional(),
})

export type BulkInspectionFormData = z.infer<typeof bulkInspectionSchema>

export const bulkSurveySchema = z.object({
  surveyType: z.string().min(1, 'Survey type is required'),
  scheduledDate: z.string().min(1, 'Scheduled date is required'),
  assignedTo: z.string().min(1, 'Assigned person is required'),
  notes: z.string().optional(),
})

export type BulkSurveyFormData = z.infer<typeof bulkSurveySchema>

export const bulkDisposalSchema = z.object({
  disposalMethod: z.string().min(1, 'Disposal method is required'),
  disposalDate: z.string().min(1, 'Disposal date is required'),
  authorizedBy: z.string().min(1, 'Authorized by is required'),
  estimatedValue: z.string().optional(),
  reason: z.string().min(10, 'Please provide at least 10 characters of reason'),
  notes: z.string().optional(),
})

export type BulkDisposalFormData = z.infer<typeof bulkDisposalSchema>

export const bulkChangeStatusSchema = z.object({
  newStatus: z.string().min(1, 'New status is required'),
  reason: z.string().min(10, 'Please provide at least 10 characters of reason'),
  effectiveDate: z.string().optional(),
  notes: z.string().optional(),
})

export type BulkChangeStatusFormData = z.infer<typeof bulkChangeStatusSchema>
