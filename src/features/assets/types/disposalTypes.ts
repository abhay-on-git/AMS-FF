// ── Asset Disposal Management Types ──

export type DisposalMethod = 'auction' | 'donation' | 'scrap' | 'write-off' | 'trade-in' | 'recycling'
export type DisposalStatus = 'draft' | 'pending-review' | 'pending-approval' | 'approved' | 'in-progress' | 'completed' | 'rejected' | 'cancelled'

export interface DisposalAssetItem {
  id:               string
  assetId:          string
  name:             string
  serialNumber:     string
  type:             string
  currentLocation:  string
  condition:        string
  acquisitionValue: number
  currentNBV:       number
  disposalValue:    number
  reason:           string
}

export interface DisposalSignature {
  role:       'requesting_officer' | 'finance_reviewer' | 'approving_authority' | 'disposal_officer'
  name:       string
  status:     'pending' | 'signed' | 'declined'
  signedDate?: string
  method?:    'digital' | 'manual'
}

export interface DisposalAuditEntry {
  id:        string
  action:    string
  user:      string
  timestamp: string
  details?:  string
}

export interface DisposalRequest {
  id:             string
  disposalId:     string
  disposalMethod: DisposalMethod
  status:         DisposalStatus

  // Assignment
  requestedBy:     string
  reviewedBy:      string
  approvedBy:      string
  disposalOfficer: string
  fieldOffice:     string

  // Details
  title:         string
  justification: string
  notes:         string
  assets:        DisposalAssetItem[]

  // Financial
  totalAcquisitionValue: number
  totalNBV:              number
  totalDisposalValue:    number
  writeOffAmount:        number

  // Disposal-specific
  recipientOrganization?:  string
  auctionReferenceNumber?: string
  certificateOfDestruction?: boolean
  environmentalCompliance: boolean
  dataWipeCertified:       boolean

  // Schedule
  requestedDate:      string
  reviewDate?:        string
  approvalDate?:      string
  targetDisposalDate: string
  actualDisposalDate?: string

  // Workflow
  workflowType:   'hq' | 'field' | 'local'
  linkedSurveyId?: string
  assetsLocked:   boolean
  createdBy:      string
  createdDate:    string

  // Documents & Audit
  signatures:  DisposalSignature[]
  attachments: string[]
  auditTrail:  DisposalAuditEntry[]
}

// ── Status helpers ──

export const getDisposalStatusLabel = (status: DisposalStatus): string => {
  switch (status) {
    case 'draft':            return 'Draft'
    case 'pending-review':   return 'Pending Review'
    case 'pending-approval': return 'Pending Approval'
    case 'approved':         return 'Approved'
    case 'in-progress':      return 'In Progress'
    case 'completed':        return 'Completed'
    case 'rejected':         return 'Rejected'
    case 'cancelled':        return 'Cancelled'
  }
}

export const getDisposalStatusColor = (status: DisposalStatus): string => {
  switch (status) {
    case 'draft':            return 'bg-gray-500/10 text-gray-700 dark:text-gray-300'
    case 'pending-review':   return 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300'
    case 'pending-approval': return 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
    case 'approved':         return 'bg-blue-500/10 text-blue-700 dark:text-blue-300'
    case 'in-progress':      return 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300'
    case 'completed':        return 'bg-green-500/10 text-green-700 dark:text-green-300'
    case 'rejected':         return 'bg-red-500/10 text-red-700 dark:text-red-300'
    case 'cancelled':        return 'bg-gray-500/10 text-gray-700 dark:text-gray-300'
    default:                 return 'bg-gray-500/10 text-gray-700 dark:text-gray-300'
  }
}

export const getDisposalMethodLabel = (method: DisposalMethod): string => {
  switch (method) {
    case 'auction':   return 'Auction'
    case 'donation':  return 'Donation'
    case 'scrap':     return 'Scrap'
    case 'write-off': return 'Write-Off'
    case 'trade-in':  return 'Trade-In'
    case 'recycling': return 'Recycling'
  }
}

export const getDisposalMethodColor = (method: DisposalMethod): string => {
  switch (method) {
    case 'auction':   return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
    case 'donation':  return 'bg-blue-500/10 text-blue-700 dark:text-blue-300'
    case 'scrap':     return 'bg-orange-500/10 text-orange-700 dark:text-orange-300'
    case 'write-off': return 'bg-red-500/10 text-red-700 dark:text-red-300'
    case 'trade-in':  return 'bg-teal-500/10 text-teal-700 dark:text-teal-300'
    case 'recycling': return 'bg-green-500/10 text-green-700 dark:text-green-300'
  }
}
