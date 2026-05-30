export type TransferType   = 'intra-field' | 'inter-field'

export type TransferStatus =
  | 'draft'
  | 'pending-custodian'
  | 'pending-approval'
  | 'approved'
  | 'in-transit'
  | 'pending-acknowledgment'
  | 'completed'
  | 'rejected'
  | 'cancelled'

export interface TransferAssetItem {
  id:              string
  assetId:         string
  name:            string
  serialNumber:    string
  type:            string
  currentLocation: string
  condition:       string
  acquisitionValue?: number
}

export interface TransferSignature {
  role:       'initiating_officer' | 'receiving_custodian' | 'approving_officer'
  name:       string
  status:     'pending' | 'signed' | 'declined'
  signedDate?: string
  method?:    'digital' | 'manual'
}

export interface TransferAuditEntry {
  id:        string
  action:    string
  user:      string
  timestamp: string
  details?:  string
  oldValue?: string
  newValue?: string
}

export interface TransferRequest {
  id:           string
  transferId:   string
  transferType: TransferType
  status:       TransferStatus

  // From
  fromCustodian:  string
  fromLocation:   string
  fromBuilding:   string
  fromRoom:       string
  fromFieldOffice: string

  // To
  toCustodian:  string
  toLocation:   string
  toBuilding:   string
  toRoom:       string
  toFieldOffice: string

  // Details
  reason:  string
  notes:   string
  assets:  TransferAssetItem[]

  // Workflow
  initiatedBy:    string
  initiatedDate:  string
  approvedBy?:    string
  approvedDate?:  string
  receivedBy?:    string
  receivedDate?:  string
  completedDate?: string
  rejectedBy?:    string
  rejectedDate?:  string
  rejectionReason?: string

  // Signatures
  signatures: TransferSignature[]

  // Document
  formGenerated:  boolean
  formUploaded:   boolean
  attachments:    string[]

  // Notifications
  notificationsSent:       boolean
  acknowledgmentRequired:  boolean
  acknowledged:            boolean

  // Audit
  auditTrail: TransferAuditEntry[]
}

// ── Helper functions ──────────────────────────────────────────────────────────

export function getTransferStatusColor(status: TransferStatus): string {
  switch (status) {
    case 'draft':                   return 'bg-gray-500/10 text-gray-700 dark:text-gray-300'
    case 'pending-custodian':       return 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300'
    case 'pending-approval':        return 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
    case 'approved':                return 'bg-blue-500/10 text-blue-700 dark:text-blue-300'
    case 'in-transit':              return 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300'
    case 'pending-acknowledgment':  return 'bg-purple-500/10 text-purple-700 dark:text-purple-300'
    case 'completed':               return 'bg-green-500/10 text-green-700 dark:text-green-300'
    case 'rejected':                return 'bg-red-500/10 text-red-700 dark:text-red-300'
    case 'cancelled':               return 'bg-gray-500/10 text-gray-700 dark:text-gray-300'
    default:                        return 'bg-gray-500/10 text-gray-700 dark:text-gray-300'
  }
}

export function getTransferStatusLabel(status: TransferStatus): string {
  switch (status) {
    case 'draft':                  return 'Draft'
    case 'pending-custodian':      return 'Pending Custodian'
    case 'pending-approval':       return 'Pending Approval'
    case 'approved':               return 'Approved'
    case 'in-transit':             return 'In Transit'
    case 'pending-acknowledgment': return 'Pending Acknowledgment'
    case 'completed':              return 'Completed'
    case 'rejected':               return 'Rejected'
    case 'cancelled':              return 'Cancelled'
  }
}

export function getTransferTypeLabel(type: TransferType): string {
  return type === 'intra-field' ? 'Intra-Field' : 'Inter-Field'
}

export function getTransferTypeColor(type: TransferType): string {
  return type === 'intra-field'
    ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300'
    : 'bg-violet-500/10 text-violet-700 dark:text-violet-300'
}
