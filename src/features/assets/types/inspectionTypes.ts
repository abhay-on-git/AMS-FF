export type InspectionType   = 'scheduled' | 'spot-check' | 'pre-transfer' | 'post-incident' | 'regulatory'
export type InspectionStatus = 'draft' | 'scheduled' | 'in-progress' | 'pending-review' | 'completed' | 'failed' | 'cancelled'
export type InspectionResult = 'pass' | 'fail' | 'conditional-pass' | 'pending'

export interface InspectionAssetItem {
  id:              string
  assetId:         string
  name:            string
  serialNumber:    string
  type:            string
  currentLocation: string
  condition:       string
  result:          InspectionResult
  findings?:       string
}

export interface ChecklistItem {
  id:      string
  label:   string
  checked: boolean
  notes?:  string
}

export interface InspectionSignature {
  role:       'inspector' | 'reviewer' | 'custodian'
  name:       string
  status:     'pending' | 'signed' | 'declined'
  signedDate?: string
  method?:    'digital' | 'manual'
}

export interface InspectionAuditEntry {
  id:        string
  action:    string
  user:      string
  timestamp: string
  details?:  string
}

export interface InspectionRequest {
  id:             string
  inspectionId:   string
  inspectionType: InspectionType
  status:         InspectionStatus
  result:         InspectionResult

  // Assignment
  inspector:   string
  reviewer:    string
  fieldOffice: string
  location:    string

  // Schedule
  scheduledDate:  string
  startedDate?:   string
  completedDate?: string
  dueDate:        string

  // Details
  title:       string
  description: string
  assets:      InspectionAssetItem[]
  checklist:   ChecklistItem[]

  // Findings
  overallFindings: string
  recommendations: string
  photosAttached:  number

  // Workflow
  createdBy:   string
  createdDate: string

  // Signatures
  signatures: InspectionSignature[]

  // Audit
  auditTrail: InspectionAuditEntry[]
}

// ── Helper functions ──────────────────────────────────────────────────────────

export function getInspectionStatusColor(status: InspectionStatus): string {
  switch (status) {
    case 'draft':          return 'bg-gray-500/10 text-gray-700 dark:text-gray-300'
    case 'scheduled':      return 'bg-blue-500/10 text-blue-700 dark:text-blue-300'
    case 'in-progress':    return 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
    case 'pending-review': return 'bg-purple-500/10 text-purple-700 dark:text-purple-300'
    case 'completed':      return 'bg-green-500/10 text-green-700 dark:text-green-300'
    case 'failed':         return 'bg-red-500/10 text-red-700 dark:text-red-300'
    case 'cancelled':      return 'bg-gray-500/10 text-gray-700 dark:text-gray-300'
    default:               return 'bg-gray-500/10 text-gray-700 dark:text-gray-300'
  }
}

export function getInspectionStatusLabel(status: InspectionStatus): string {
  switch (status) {
    case 'draft':          return 'Draft'
    case 'scheduled':      return 'Scheduled'
    case 'in-progress':    return 'In Progress'
    case 'pending-review': return 'Pending Review'
    case 'completed':      return 'Completed'
    case 'failed':         return 'Failed'
    case 'cancelled':      return 'Cancelled'
  }
}

export function getInspectionTypeLabel(type: InspectionType): string {
  switch (type) {
    case 'scheduled':    return 'Scheduled'
    case 'spot-check':   return 'Spot Check'
    case 'pre-transfer': return 'Pre-Transfer'
    case 'post-incident':return 'Post-Incident'
    case 'regulatory':   return 'Regulatory'
  }
}

export function getInspectionTypeColor(type: InspectionType): string {
  switch (type) {
    case 'scheduled':    return 'bg-blue-500/10 text-blue-700 dark:text-blue-300'
    case 'spot-check':   return 'bg-orange-500/10 text-orange-700 dark:text-orange-300'
    case 'pre-transfer': return 'bg-teal-500/10 text-teal-700 dark:text-teal-300'
    case 'post-incident':return 'bg-red-500/10 text-red-700 dark:text-red-300'
    case 'regulatory':   return 'bg-violet-500/10 text-violet-700 dark:text-violet-300'
  }
}

export function getResultColor(result: InspectionResult): string {
  switch (result) {
    case 'pass':             return 'bg-green-500/10 text-green-700 dark:text-green-300'
    case 'fail':             return 'bg-red-500/10 text-red-700 dark:text-red-300'
    case 'conditional-pass': return 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
    case 'pending':          return 'bg-gray-500/10 text-gray-700 dark:text-gray-300'
  }
}

export function getResultLabel(result: InspectionResult): string {
  switch (result) {
    case 'pass':             return 'Pass'
    case 'fail':             return 'Fail'
    case 'conditional-pass': return 'Conditional Pass'
    case 'pending':          return 'Pending'
  }
}
