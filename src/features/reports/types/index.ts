import type { ReactNode } from 'react'

export interface PredefinedReport {
  id: string
  name: string
  description: string
  category: 'Asset Register' | 'Lifecycle' | 'Disposal' | 'Transfer'
  icon: ReactNode
  accessLevel: 'all' | 'manager' | 'admin'
}

export interface CustomFilter {
  field: string
  operator: string
  value: string
}

export interface SavedQuery {
  id: string
  name: string
  description: string
  filters: CustomFilter[]
  selectedFields: string[]
  groupBy?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  createdBy: string
  createdAt: string
}

export interface ScheduledReport {
  id: string
  name: string
  reportType: string
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly'
  recipients: string[]
  format: 'excel' | 'pdf' | 'csv'
  nextRun: string
  lastRun?: string
  enabled: boolean
  createdBy: string
}

export interface PendingAction {
  id: string
  type: 'inspection' | 'disposal' | 'transfer' | 'tagging' | 'verification'
  description: string
  assetCount: number
  dueDate: string
  assignedTo: string
  fieldOffice: string
}

export type ViewMode = 'dashboard' | 'predefined' | 'custom' | 'scheduled'

export interface AssetValueDataPoint {
  name: string
  value: number
  count: number
}

export interface LifecycleDataPoint {
  name: string
  value: number
  percentage: number
}

export interface MonthlyTrendPoint {
  month: string
  acquisitions: number
  disposals: number
  transfers: number
}

export interface SurveyVolumePoint {
  month: string
  opened: number
  completed: number
  inProgress: number
}

export interface DisposalTrendPoint {
  month: string
  auction: number
  donation: number
  recycling: number
  writeOff: number
}

export interface ComplianceGap {
  type: string
  count: number
}

export interface ComplianceGapDetail extends ComplianceGap {
  id: string
  description: string
  regulation: string
  dueDate: string
  assignedTo: string
}

export interface AffectedAsset {
  id: string
  name: string
  tag: string
  location: string
  status: string
  category: string
  lastScanned?: string
  issue?: string
}

export interface DetailNote {
  date: string
  user: string
  note: string
}

export interface DetailTimelineEntry {
  date: string
  user: string
  event: string
}

export interface PendingActionDetailData {
  action: PendingAction
  assets: AffectedAsset[]
  timeline: DetailTimelineEntry[]
  notes: DetailNote[]
}

export interface ComplianceGapDetailData {
  gap: ComplianceGapDetail
  assets: AffectedAsset[]
  timeline: DetailTimelineEntry[]
  notes: DetailNote[]
}

export interface OfficeMetrics {
  totalAssets: number
  totalValue: string
  pendingCount: number
  assetValueByLocation: AssetValueDataPoint[]
  lifecycleBreakdown: LifecycleDataPoint[]
  monthlyTrends: MonthlyTrendPoint[]
  surveyCaseVolume: SurveyVolumePoint[]
  disposalTrends: DisposalTrendPoint[]
  complianceGaps: ComplianceGap[]
}

export interface ReportRow {
  assetId: string
  name: string
  category: string
  serialNumber: string
  location: string
  fieldOffice: string
  custodian: string
  status: string
  condition: string
  value: string
  nbv: string
  purchaseDate: string
  poNumber: string
  supplier: string
  lastInspection: string
}

export interface ReportFieldDefinition {
  id: keyof ReportRow | string
  label: string
  sensitive: boolean
}

export type ReportSortOrder = 'asc' | 'desc'

export interface CreateSchedulePayload {
  name: string
  reportType: string
  frequency: ScheduledReport['frequency']
  recipients: string[]
  format: ScheduledReport['format']
}

export interface UpdateSchedulePayload extends Partial<CreateSchedulePayload> {
  enabled?: boolean
  nextRun?: string
  lastRun?: string
}
