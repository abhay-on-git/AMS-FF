// ── Asset Survey Management Types ──

export type SurveyType    = 'full-count' | 'sample-based' | 'location-based' | 'custodian-based' | 'high-value'
export type SurveyStatus  = 'draft' | 'planned' | 'in-progress' | 'reconciliation' | 'pending-approval' | 'completed' | 'cancelled'
export type DiscrepancyType = 'missing' | 'location-mismatch' | 'condition-change' | 'untagged' | 'surplus'

export interface SurveyAssetItem {
  id:                string
  assetId:           string
  name:              string
  serialNumber:      string
  type:              string
  expectedLocation:  string
  actualLocation:    string
  expectedCondition: string
  actualCondition:   string
  verified:          boolean
  discrepancy?:      DiscrepancyType
  notes?:            string
  acquisitionValue?: number
  nbv?:              number
}

export interface SurveySignature {
  role:       'surveyor' | 'team_lead' | 'approver'
  name:       string
  status:     'pending' | 'signed' | 'declined'
  signedDate?: string
  method?:    'digital' | 'manual'
}

export interface SurveyAuditEntry {
  id:        string
  action:    string
  user:      string
  timestamp: string
  details?:  string
}

export interface SurveyRequest {
  id:         string
  surveyId:   string
  surveyType: SurveyType
  status:     SurveyStatus

  // Assignment
  surveyTeamLead:   string
  surveyors:        string[]
  fieldOffice:      string
  targetLocations:  string[]

  // Schedule
  plannedStartDate: string
  plannedEndDate:   string
  actualStartDate?: string
  actualEndDate?:   string

  // Details
  title:       string
  description: string
  scope:       string

  // Results
  assets:              SurveyAssetItem[]
  totalExpected:       number
  totalVerified:       number
  totalDiscrepancies:  number
  accuracyRate:        number

  // Workflow
  workflowType:    'hq' | 'field' | 'local'
  linkedDisposalId?: string
  assetsLocked:    boolean
  createdBy:       string
  createdDate:     string
  approvedBy?:     string
  approvedDate?:   string

  // Documents & Audit
  signatures:      SurveySignature[]
  attachments:     string[]
  reportGenerated: boolean
  auditTrail:      SurveyAuditEntry[]
}

// ── Status helpers ──

export const getSurveyStatusLabel = (status: SurveyStatus): string => {
  switch (status) {
    case 'draft':            return 'Draft'
    case 'planned':          return 'Planned'
    case 'in-progress':      return 'In Progress'
    case 'reconciliation':   return 'Reconciliation'
    case 'pending-approval': return 'Pending Approval'
    case 'completed':        return 'Completed'
    case 'cancelled':        return 'Cancelled'
  }
}

export const getSurveyStatusColor = (status: SurveyStatus): string => {
  switch (status) {
    case 'draft':            return 'bg-gray-500/10 text-gray-700 dark:text-gray-300'
    case 'planned':          return 'bg-blue-500/10 text-blue-700 dark:text-blue-300'
    case 'in-progress':      return 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
    case 'reconciliation':   return 'bg-purple-500/10 text-purple-700 dark:text-purple-300'
    case 'pending-approval': return 'bg-orange-500/10 text-orange-700 dark:text-orange-300'
    case 'completed':        return 'bg-green-500/10 text-green-700 dark:text-green-300'
    case 'cancelled':        return 'bg-gray-500/10 text-gray-700 dark:text-gray-300'
    default:                 return 'bg-gray-500/10 text-gray-700 dark:text-gray-300'
  }
}

export const getSurveyTypeLabel = (type: SurveyType): string => {
  switch (type) {
    case 'full-count':       return 'Full Count'
    case 'sample-based':     return 'Sample-Based'
    case 'location-based':   return 'Location-Based'
    case 'custodian-based':  return 'Custodian-Based'
    case 'high-value':       return 'High-Value'
  }
}

export const getSurveyTypeColor = (type: SurveyType): string => {
  switch (type) {
    case 'full-count':       return 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300'
    case 'sample-based':     return 'bg-teal-500/10 text-teal-700 dark:text-teal-300'
    case 'location-based':   return 'bg-blue-500/10 text-blue-700 dark:text-blue-300'
    case 'custodian-based':  return 'bg-violet-500/10 text-violet-700 dark:text-violet-300'
    case 'high-value':       return 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
  }
}

export const getDiscrepancyLabel = (type: DiscrepancyType): string => {
  switch (type) {
    case 'missing':           return 'Missing'
    case 'location-mismatch': return 'Location Mismatch'
    case 'condition-change':  return 'Condition Change'
    case 'untagged':          return 'Untagged'
    case 'surplus':           return 'Surplus'
  }
}

export const getDiscrepancyColor = (type: DiscrepancyType): string => {
  switch (type) {
    case 'missing':           return 'bg-red-500/10 text-red-700 dark:text-red-300'
    case 'location-mismatch': return 'bg-orange-500/10 text-orange-700 dark:text-orange-300'
    case 'condition-change':  return 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
    case 'untagged':          return 'bg-purple-500/10 text-purple-700 dark:text-purple-300'
    case 'surplus':           return 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300'
  }
}
