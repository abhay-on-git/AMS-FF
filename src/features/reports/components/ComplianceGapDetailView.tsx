import {
  AlertCircle,
  Bug,
  CheckCircle,
  ClipboardCheck,
  FileText,
  Package,
  User,
  Wrench,
} from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate } from '@/lib/utils/dateFormatter'
import { useComplianceGapDetail } from '../hooks/useReportDetails'
import { daysUntilDue, getInitials, isOverdue } from '../utils/reportDetailUtils'
import { ReportsBackNav } from './ReportsBackNav'
import { DetailAffectedAssetsCard } from './detail/DetailAffectedAssetsCard'
import { DetailMetaCard } from './detail/DetailMetaCard'
import { DetailNotesCard } from './detail/DetailNotesCard'
import { DetailTimelineCard } from './detail/DetailTimelineCard'

interface ComplianceGapDetailViewProps {
  gapType: string
  onBack: () => void
}

function gapIcon(type: string) {
  if (type.includes('Serial')) return Bug
  if (type.includes('Untagged')) return Package
  if (type.includes('Inspection')) return ClipboardCheck
  if (type.includes('Custodian')) return User
  if (type.includes('Documentation')) return FileText
  return AlertCircle
}

function gapTypeLabel(type: string) {
  if (type.includes('Serial')) return 'Requires data entry or physical verification'
  if (type.includes('Untagged')) return 'RFID tag assignment needed'
  if (type.includes('Inspection')) return 'Schedule and complete inspections'
  if (type.includes('Custodian')) return 'Assign responsible custodians'
  if (type.includes('Documentation')) return 'Upload or obtain missing documents'
  return 'Compliance remediation required'
}

export function ComplianceGapDetailView({ gapType, onBack }: ComplianceGapDetailViewProps) {
  const { data, isLoading } = useComplianceGapDetail(gapType)

  if (isLoading) {
    return <Skeleton className="h-[640px] w-full rounded-xl" />
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="mb-4 h-12 w-12 text-muted-foreground" />
        <p className="mb-4 text-muted-foreground">Compliance gap not found</p>
        <Button variant="outline" onClick={onBack}>Back to Dashboard</Button>
      </div>
    )
  }

  const { gap, assets, timeline, notes } = data
  const overdue = isOverdue(gap.dueDate)
  const daysLeft = daysUntilDue(gap.dueDate)
  const Icon = gapIcon(gap.type)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <ReportsBackNav label={gap.id} onBack={onBack} />
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-semibold">{gap.id}</h2>
            {overdue && (
              <Badge className="bg-destructive/10 text-destructive">Overdue</Badge>
            )}
            <Badge className="gap-1 bg-brand-navy/10 text-brand-navy dark:text-white">
              <Icon className="h-4 w-4" />
              <span>{gap.type}</span>
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {gap.description} · Regulation: {gap.regulation} · {gap.count} asset{gap.count !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button className="bg-brand-navy text-white hover:bg-brand-navy-mid" size="sm" onClick={() => toast.success(`Gap ${gap.id} marked as resolved`)}>
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
        <SummaryCard label="Affected Assets" value={String(gap.count)} sub={`${assets.length} listed below`} />
        <SummaryCard
          label="Remediation Deadline"
          value={formatDate(gap.dueDate)}
          sub={overdue ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days remaining`}
          highlight={overdue}
        />
        <Card>
          <CardContent className="p-4">
            <p className="mb-1 text-xs text-muted-foreground">Assigned To</p>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-navy text-xs text-white">
                {getInitials(gap.assignedTo)}
              </div>
              <span className="text-sm">{gap.assignedTo}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="mb-1 text-xs text-muted-foreground">Regulation</p>
            <div className="mt-2 flex items-center gap-2">
              <Wrench className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{gap.regulation}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{gapTypeLabel(gap.type)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <DetailAffectedAssetsCard assets={assets} variant="compliance" />
          <DetailNotesCard notes={notes} />
        </div>
        <div className="space-y-6">
          <DetailTimelineCard timeline={timeline} />
          <DetailMetaCard
            rows={[
              { label: 'Created', value: formatDate(timeline[timeline.length - 1]?.date ?? gap.dueDate) },
              { label: 'Deadline', value: formatDate(gap.dueDate), highlight: overdue },
              { label: 'Gap Type', value: gap.type },
              { label: 'Regulation', value: gap.regulation },
              { label: 'Status', value: overdue ? 'Overdue' : 'In Progress', badge: true, highlight: overdue },
              { label: 'Asset Count', value: String(gap.count) },
              { label: 'Assigned To', value: gap.assignedTo },
              { label: 'Last Updated', value: formatDate(timeline[0]?.date ?? gap.dueDate) },
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
