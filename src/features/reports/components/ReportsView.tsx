import { useState } from 'react'
import type { ComplianceGap, PendingAction, ViewMode } from '../types'
import { CustomReportView } from './CustomReportView'
import { PredefinedReportsView } from './PredefinedReportsView'
import { ReportsDashboardView } from './ReportsDashboardView'
import { ScheduledReportsView } from './ScheduledReportsView'

interface ReportsViewProps {
  onViewPendingAction?: (action: PendingAction) => void
  onViewComplianceGap?: (gap: ComplianceGap) => void
}

export function ReportsView({
  onViewPendingAction,
  onViewComplianceGap,
}: ReportsViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard')

  if (viewMode === 'predefined') {
    return <PredefinedReportsView onBack={() => setViewMode('dashboard')} />
  }
  if (viewMode === 'scheduled') {
    return <ScheduledReportsView onBack={() => setViewMode('dashboard')} />
  }
  if (viewMode === 'custom') {
    return <CustomReportView onBack={() => setViewMode('dashboard')} />
  }

  return (
    <ReportsDashboardView
      onViewPendingAction={onViewPendingAction}
      onViewComplianceGap={onViewComplianceGap}
      onOpenPredefined={() => setViewMode('predefined')}
      onOpenScheduled={() => setViewMode('scheduled')}
      onOpenCustom={() => setViewMode('custom')}
    />
  )
}
