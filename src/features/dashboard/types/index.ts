// ── Trend chart ─────────────────────────────────────────────────────────────

export type TrendPeriod = 'weekly' | 'monthly' | 'quarterly' | 'yearly'

export interface AssetTrendPoint {
  month:     string
  total:     number
  acquired:  number
  disposed:  number
}

export interface TrendDataSet {
  label: string
  data:  AssetTrendPoint[][]
}

export type TrendDataSets = Record<TrendPeriod, TrendDataSet>

// ── Distribution & health ─────────────────────────────────────────────────────

export interface CategoryDistributionItem {
  name:  string
  value: number
  color: string
}

export interface StatusBreakdownItem {
  status: string
  count:  number
  color:  string
}

export interface LocationDistributionItem {
  name:   string
  assets: number
  pct:    number
}

export interface ConditionBreakdownItem {
  condition: string
  count:     number
}

// ── KPI ─────────────────────────────────────────────────────────────────────

export type KpiIconKey = 'package' | 'check-circle' | 'transfer' | 'inspection'

export interface KpiCardItem {
  label:    string
  value:    string
  change:   string
  up:       boolean
  iconKey:  KpiIconKey
  href:     string
}

// ── Pending actions ───────────────────────────────────────────────────────────

export type PendingActionType = 'transfer' | 'inspection' | 'disposal' | 'survey'
export type PendingActionUrgency = 'high' | 'medium' | 'low'

export interface PendingAction {
  id:       string
  type:     PendingActionType
  title:    string
  desc:     string
  assignee: string
  urgency:  PendingActionUrgency
  due:      string
}

// ── Activity feed ─────────────────────────────────────────────────────────────

export type ActivityStatus = 'success' | 'pending' | 'warning' | 'info'

export interface RecentActivityItem {
  id:     string
  action: string
  user:   string
  module: string
  time:   string
  status: ActivityStatus
  avatar: string
}

// ── Inspections ───────────────────────────────────────────────────────────────

export type InspectionProgressStatus = 'in-progress' | 'assigned' | 'completed'

export interface InspectionProgressItem {
  id:        string
  title:     string
  inspector: string
  office:    string
  progress:  number
  total:     number
  verified:  number
  issues:    number
  status:    InspectionProgressStatus
}

// ── Compliance & system ───────────────────────────────────────────────────────

export type ComplianceStatus = 'good' | 'warning'

export interface ComplianceMetric {
  label:  string
  value:  number
  target: number
  status: ComplianceStatus
}

export interface SystemStatusItem {
  label:  string
  status: string
}

export type QuickLinkIconKey =
  | 'package'
  | 'folder'
  | 'map-pin'
  | 'bar-chart'
  | 'users'
  | 'inspection'

export interface QuickLink {
  label:   string
  iconKey: QuickLinkIconKey
  href:    string
}

// ── Recharts pie label ────────────────────────────────────────────────────────

export interface PieLabelProps {
  cx:           number
  cy:           number
  midAngle:     number
  innerRadius:  number
  outerRadius:  number
  percent:      number
}
