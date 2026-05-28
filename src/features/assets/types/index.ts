export type AssetStatus = 'active' | 'inactive' | 'maintenance' | 'disposed' | 'missing' | 'in-transit'

export type AssetCondition = 'new' | 'good' | 'fair' | 'poor' | 'damaged'

export type ViewMode = 'list' | 'detail'

export type ActiveTab = 'all' | 'drafts' | 'transfers' | 'inspections' | 'surveys' | 'disposals'

export interface EnhancedAsset {
  id: string
  assetId: string
  epc: string
  barcode: string
  serialNumber: string
  type: string
  category?: string
  name: string
  description?: string
  location: string
  fieldOffice: string
  status: AssetStatus
  publishedDate: string
  responsiblePerson: string
  owner: string
  condition: AssetCondition
  createdDate: string
  lastUpdated: string
  lastStatusChange: string
  lastLocationUpdate: string
  lastCustodianChange: string
  notes?: string
  rfidHealth?: number
  lastScanned?: string
  isLocked?: boolean
  lockReason?: string
  activeSurveyCaseId?: string
  poNumber?: string
  grnNumber?: string
  acquisitionDate?: string
  acquisitionValue?: number
  currency?: string
  nbv?: number
  lifecycleStage?: 'registered' | 'active' | 'maintenance' | 'survey' | 'pending-disposal' | 'disposed'
  expectedUsefulLife?: number
  warrantyExpiry?: string
  depreciationMethod?: 'straight-line' | 'declining-balance'
  annualDepreciationRate?: number
  residualValue?: number
  nextMaintenanceDate?: string
  lastMaintenanceDate?: string
  maintenanceCount?: number
  transferCount?: number
  surveyStatus?: 'not-surveyed' | 'survey-pending' | 'surveyed' | 'recommended-disposal'
  disposalMethod?: string
  disposalDate?: string
  disposalApprovalStatus?: 'pending' | 'approved' | 'rejected'
}

export interface AdvancedFilterState {
  fieldOffice: string
  location: string
  custodian: string
  assetType: string
  category: string
  lifecycleStatus: string
  poNumber: string
  grnNumber: string
  acquisitionDateFrom: string
  acquisitionDateTo: string
  lastUpdatedFrom: string
  lastUpdatedTo: string
  valueMin: string
  valueMax: string
  condition: string
  supplier: string
  warrantyStatus: string
  rfidTagStatus: string
  inspectionStatus: string
  usageStatus: string
}

export const defaultAdvancedFilters: AdvancedFilterState = {
  fieldOffice: 'all',
  location: 'all',
  custodian: '',
  assetType: 'all',
  category: 'all',
  lifecycleStatus: 'all',
  poNumber: '',
  grnNumber: '',
  acquisitionDateFrom: '',
  acquisitionDateTo: '',
  lastUpdatedFrom: '',
  lastUpdatedTo: '',
  valueMin: '',
  valueMax: '',
  condition: 'all',
  supplier: 'all',
  warrantyStatus: 'all',
  rfidTagStatus: 'all',
  inspectionStatus: 'all',
  usageStatus: 'all',
}

export interface AssetColumnConfig {
  key: string
  label: string
  visible: boolean
  category: 'default' | 'tracking' | 'financial'
}

// --- Detail View Types (Sprint 5B) ---

export type LifecycleStageType =
  | 'registered'
  | 'active'
  | 'maintenance'
  | 'survey'
  | 'pending-disposal'
  | 'disposed'

export type DetailTab = 'overview' | 'lifecycle' | 'history'

export type UserRole = 'admin' | 'smio' | 'auditor' | 'senior_management'

export interface LifecycleEvent {
  id: string
  stage: string
  action: string
  date: string
  user: string
  details: string
  icon: string
}

export interface AuditEvent {
  id: string
  eventType: 'status_change' | 'location_change' | 'transfer' | 'edit' | 'inspection' | 'disposal' | 'created' | 'custodian_change'
  action: string
  oldValue?: string
  newValue?: string
  user: string
  timestamp: string
  fieldOffice: string
  comment?: string
  details?: string
}
