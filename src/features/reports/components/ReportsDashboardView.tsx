import { useState } from 'react'
import { AlertCircle, Building2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { FIELD_OFFICES } from '../constants/reportingData'
import {
  useComplianceGaps,
  useDashboardData,
  usePendingActions,
} from '../hooks/useReportsDashboard'
import type { ComplianceGap, PendingAction } from '../types'
import { ComplianceGapsTable } from './ComplianceGapsTable'
import { PendingActionsTable } from './PendingActionsTable'
import { ReportsDashboardCharts } from './ReportsDashboardCharts'
import { ReportsDashboardKPIs } from './ReportsDashboardKPIs'

interface ReportsDashboardViewProps {
  onViewPendingAction?: (action: PendingAction) => void
  onViewComplianceGap?: (gap: ComplianceGap) => void
}

export function ReportsDashboardView({
  onViewPendingAction,
  onViewComplianceGap,
}: ReportsDashboardViewProps) {
  const [fieldOffice, setFieldOffice] = useState<string>('All Offices')
  const { data: metrics, isLoading: metricsLoading } = useDashboardData(fieldOffice)
  const { data: pendingActions = [], isLoading: pendingLoading } = usePendingActions(fieldOffice)
  const { data: complianceGaps = [], isLoading: gapsLoading } = useComplianceGaps(fieldOffice)

  return (
    <div className="space-y-6">
      <Select value={fieldOffice} onValueChange={setFieldOffice}>
        <SelectTrigger className="h-11 min-w-[220px] text-base">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {FIELD_OFFICES.map((office) => (
            <SelectItem key={office} value={office} className="text-base">
              {office}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {fieldOffice !== 'All Offices' && (
        <Badge className="gap-1.5 bg-brand-navy px-3 py-1.5 text-sm text-white">
          <Building2 className="h-3.5 w-3.5" />
          Showing data for: {fieldOffice}
        </Badge>
      )}

      <ReportsDashboardKPIs metrics={metrics} isLoading={metricsLoading} />

      <div className="space-y-6">
        {metricsLoading ? (
          <Skeleton className="h-[640px] w-full rounded-xl" />
        ) : (
          <ReportsDashboardCharts metrics={metrics} />
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            Pending Actions Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingLoading ? (
            <Skeleton className="h-48 w-full rounded-md" />
          ) : (
            <PendingActionsTable
              actions={pendingActions}
              onViewDetail={(action) => onViewPendingAction?.(action)}
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertCircle className="h-5 w-5 text-destructive" />
            Compliance Gaps Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          {gapsLoading ? (
            <Skeleton className="h-40 w-full rounded-md" />
          ) : (
            <ComplianceGapsTable
              gaps={complianceGaps}
              onViewDetail={(gap) => onViewComplianceGap?.(gap)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
