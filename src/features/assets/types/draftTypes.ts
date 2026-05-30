export type DraftClassification = 'Capital' | 'Attractive'
export type DraftAssignmentStatus = 'Unassigned' | 'Assigned'
export type DraftUserRole = 'smio' | 'admin' | 'auditor'

export interface DraftAuditEntry {
  id: string
  action: string
  user: string
  timestamp: string
  details?: string
}

export interface DraftAsset {
  id: string
  draftId: string
  poNumber: string
  grnNumber: string
  itemDescription: string
  supplier: string
  quantity: number
  unitPrice: number
  totalCost: number
  acquisitionDate: string
  currency: string
  classification: DraftClassification
  classificationOverridden: boolean
  assignmentStatus: DraftAssignmentStatus
  assignedTo?: string
  sapSyncTimestamp: string
  auditTrail: DraftAuditEntry[]
}

export interface RegistrationForm {
  serialNumber: string
  fieldOffice: string
  location: string
  custodian: string
  assetCondition: string
  barcodeTagId: string
  classificationOverride: string
}
