import { Clock, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ReportsDashboardActionsProps {
  onOpenPredefined: () => void
  onOpenScheduled: () => void
  onOpenCustom: () => void
}

export function ReportsDashboardActions({
  onOpenPredefined,
  onOpenScheduled,
  onOpenCustom,
}: ReportsDashboardActionsProps) {
  return (
    <div className="flex shrink-0 flex-nowrap items-center gap-3">
      <Button
        variant="outline"
        onClick={onOpenPredefined}
        className="h-11 shrink-0 whitespace-nowrap px-5 text-base"
      >
        <FileText className="mr-2 h-5 w-5" />
        Predefined Reports
      </Button>
      <Button
        variant="outline"
        onClick={onOpenScheduled}
        className="h-11 shrink-0 whitespace-nowrap px-5 text-base"
      >
        <Clock className="mr-2 h-5 w-5" />
        Scheduled Reports
      </Button>
      <Button
        onClick={onOpenCustom}
        className="h-11 shrink-0 whitespace-nowrap bg-brand-navy px-5 text-base text-white hover:bg-brand-navy-mid"
      >
        Custom Report
      </Button>
    </div>
  )
}
