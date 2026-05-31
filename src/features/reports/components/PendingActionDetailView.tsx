import {
  AlertCircle,
  CheckCircle,
  ClipboardCheck,
  Gavel,
  Package,
  Search,
  User,
} from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate } from '@/lib/utils/dateFormatter'
import { usePendingActionDetail } from '../hooks/useReportDetails'
import type { PendingAction } from '../types'
import { daysUntilDue, getInitials, isOverdue } from '../utils/reportDetailUtils'
import { ReportsBackNav } from './ReportsBackNav'
import { DetailAffectedAssetsCard } from './detail/DetailAffectedAssetsCard'
import { DetailMetaCard } from './detail/DetailMetaCard'
import { DetailNotesCard } from './detail/DetailNotesCard'
import { DetailTimelineCard } from './detail/DetailTimelineCard'

interface PendingActionDetailViewProps {
  actionId: string
  onBack: () => void
}

function actionIcon(type: PendingAction['type']) {
  switch (type) {
    case 'inspection':
      return Search
    case 'disposal':
      return Gavel
    case 'transfer':
      return Package
    case 'tagging':
      return ClipboardCheck
    case 'verification':
      return CheckCircle
  }
}

function typeLabel(type: PendingAction['type']) {
  switch (type) {
    case 'inspection':
      return 'Requires physical check'
    case 'disposal':
      return 'Needs approval workflow'
    case 'transfer':
      return 'Awaiting acknowledgment'
    case 'tagging':
      return 'RFID assignment needed'
    case 'verification':
      return 'Post-action verification'
  }
}

export function PendingActionDetailView({ actionId, onBack }: PendingActionDetailViewProps) {
  const { data, isLoading } = usePendingActionDetail(actionId)

  if (isLoading) {
    return <Skeleton className="h-[640px] w-full rounded-xl" />
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="mb-4 h-12 w-12 text-muted-foreground" />
        <p className="mb-4 text-muted-foreground">Action not found</p>
        <Button variant="outline" onClick={onBack}>Back to Dashboard</Button>
      </div>
    )
  }

  const { action, assets, timeline, notes } = data
  const overdue = isOverdue(action.dueDate)
  const daysLeft = daysUntilDue(action.dueDate)
  const Icon = actionIcon(action.type)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <ReportsBackNav label={action.id} onBack={onBack} />
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-semibold">{action.id}</h2>
            {overdue && (
              <Badge className="bg-destructive/10 text-destructive">Overdue</Badge>
            )}
            <Badge className="gap-1 bg-brand-navy/10 text-brand-navy dark:text-white">
              <Icon className="h-4 w-4" />
              <span className="capitalize">{action.type}</span>
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {action.description} · Assigned to: {action.assignedTo} · {action.assetCount} asset{action.assetCount !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button className="bg-brand-navy text-white hover:bg-brand-navy-mid" size="sm" onClick={() => toast.success(`Action ${action.id} marked as resolved`)}>
            <CheckCircle className="mr-1 h-4 w-4" />
            Resolve
          </Button>
          <Button size="sm" variant="outline" onClick={() => toast.info('Reassignment dialog would open')}>
            <User className="mr-1 h-4 w-4" />
            Reassign
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Affected Assets" value={String(action.assetCount)} sub={`${assets.length} listed below`} />
        <SummaryCard
          label="Due Date"
          value={formatDate(action.dueDate)}
          sub={overdue ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days remaining`}
          highlight={overdue}
        />
        <Card>
          <CardContent className="p-4">
            <p className="mb-1 text-xs text-muted-foreground">Assigned To</p>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-navy text-xs text-white">
                {getInitials(action.assignedTo)}
              </div>
              <div>
                <span className="text-sm">{action.assignedTo}</span>
                <p className="text-xs text-muted-foreground">Primary owner</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="mb-1 text-xs text-muted-foreground">Action Type</p>
            <div className="mt-2 flex items-center gap-2">
              <Icon className="h-4 w-4" />
              <span className="text-sm capitalize">{action.type}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{typeLabel(action.type)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <DetailAffectedAssetsCard assets={assets} variant="pending" />
          <DetailNotesCard notes={notes} />
        </div>
        <div className="space-y-6">
          <DetailTimelineCard timeline={timeline} />
          <DetailMetaCard
            rows={[
              { label: 'Created', value: formatDate(timeline[timeline.length - 1]?.date ?? action.dueDate) },
              { label: 'Due Date', value: formatDate(action.dueDate), highlight: overdue },
              { label: 'Type', value: action.type },
              { label: 'Status', value: overdue ? 'Overdue' : 'In Progress', badge: true, highlight: overdue },
              { label: 'Asset Count', value: String(action.assetCount) },
              { label: 'Assigned To', value: action.assignedTo },
              { label: 'Last Updated', value: formatDate(timeline[0]?.date ?? action.dueDate) },
            ]}
          />
        </div>
      </div>
    </div>
  )
}

function SummaryCard({ label, value, sub, highlight }: { label: string; value: string; sub: string; highlight?: boolean }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="mb-1 text-xs text-muted-foreground">{label}</p>
        <p className={`text-2xl font-semibold ${highlight ? 'text-destructive' : ''}`}>{value}</p>
        <p className={`mt-1 text-xs ${highlight ? 'text-destructive' : 'text-muted-foreground'}`}>{sub}</p>
      </CardContent>
    </Card>
  )
}
