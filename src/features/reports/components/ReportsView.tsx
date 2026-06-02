import { useState } from 'react'
import type { ComplianceGap, PendingAction, ViewMode } from '../types'
import { ComplianceGapDetailView } from './ComplianceGapDetailView'
import { CustomReportView } from './CustomReportView'
import { PendingActionDetailView } from './PendingActionDetailView'
import { PredefinedReportsView } from './PredefinedReportsView'
import { ReportsDashboardView } from './ReportsDashboardView'
import { ScheduledReportsView } from './ScheduledReportsView'

type DetailView =
  | { kind: 'pending'; actionId: string }
  | { kind: 'compliance'; gapType: string }

export function ReportsView() {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard')
  const [detail, setDetail] = useState<DetailView | null>(null)

  if (detail?.kind === 'pending') {
    return (
      <PendingActionDetailView
        actionId={detail.actionId}
        onBack={() => setDetail(null)}
      />
    )
  }

  if (detail?.kind === 'compliance') {
    return (
      <ComplianceGapDetailView
        gapType={detail.gapType}
        onBack={() => setDetail(null)}
      />
    )
  }

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
      onViewPendingAction={(action: PendingAction) => setDetail({ kind: 'pending', actionId: action.id })}
      onViewComplianceGap={(gap: ComplianceGap) => setDetail({ kind: 'compliance', gapType: gap.type })}
      onOpenPredefined={() => setViewMode('predefined')}
      onOpenScheduled={() => setViewMode('scheduled')}
      onOpenCustom={() => setViewMode('custom')}
    />
  )
}
