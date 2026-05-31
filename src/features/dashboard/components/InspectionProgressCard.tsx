import { ClipboardCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/cn'
import { INSPECTION_PROGRESS } from '../constants'
import type { InspectionProgressStatus } from '../types'

function statusLabel(status: InspectionProgressStatus): string {
  switch (status) {
    case 'in-progress':
      return 'In Progress'
    case 'assigned':
      return 'Assigned'
    case 'completed':
      return 'Completed'
    default:
      return status
  }
}

function statusBadgeClass(status: InspectionProgressStatus): string {
  switch (status) {
    case 'in-progress':
      return 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
    case 'assigned':
      return 'bg-blue-500/10 text-blue-700 dark:text-blue-400'
    case 'completed':
      return 'bg-green-500/10 text-green-700 dark:text-green-400'
    default:
      return ''
  }
}

export function InspectionProgressCard() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-15">
          <ClipboardCheck className="w-5 h-5 text-brand-navy dark:text-brand-teal" />
          Inspection Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {INSPECTION_PROGRESS.map((insp) => (
          <div key={insp.id} className="rounded-lg border p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-15 font-medium truncate">{insp.title}</p>
                <p className="text-13 text-muted-foreground">
                  {insp.inspector} · {insp.office}
                </p>
              </div>
              <Badge className={cn('shrink-0 text-[11px]', statusBadgeClass(insp.status))}>
                {statusLabel(insp.status)}
              </Badge>
            </div>
            <Progress value={insp.progress} className="h-2" />
            <div className="flex justify-between text-13 text-muted-foreground">
              <span>
                {insp.verified}/{insp.total} verified
              </span>
              <span>{insp.issues} issues</span>
              <span>{insp.progress}%</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
