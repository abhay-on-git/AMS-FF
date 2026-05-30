import { ArrowRightLeft, ClipboardCheck, Search as SurveyIcon, Trash2, RefreshCw, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BulkActionsProps {
  selectedCount: number
  onClearSelection: () => void
  onTransfer: () => void
  onInspection: () => void
  onSurvey: () => void
  onDisposal: () => void
  onChangeStatus: () => void
}

export function BulkActions({
  selectedCount,
  onClearSelection,
  onTransfer,
  onInspection,
  onSurvey,
  onDisposal,
  onChangeStatus,
}: BulkActionsProps) {
  if (selectedCount === 0) return null

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-lg border bg-muted/30">
      <span className="text-[15px] font-medium">
        {selectedCount} asset{selectedCount > 1 ? 's' : ''} selected
      </span>

      <div className="flex items-center gap-2 ml-auto">
        <Button variant="outline" size="sm" onClick={onTransfer} className="text-[15px]">
          <ArrowRightLeft className="w-4 h-4 mr-1.5" /> Transfer
        </Button>
        <Button variant="outline" size="sm" onClick={onInspection} className="text-[15px]">
          <ClipboardCheck className="w-4 h-4 mr-1.5" /> Inspection
        </Button>
        <Button variant="outline" size="sm" onClick={onSurvey} className="text-[15px]">
          <SurveyIcon className="w-4 h-4 mr-1.5" /> Survey
        </Button>
        <Button variant="outline" size="sm" onClick={onDisposal} className="text-[15px]">
          <Trash2 className="w-4 h-4 mr-1.5" /> Disposal
        </Button>
        <Button variant="outline" size="sm" onClick={onChangeStatus} className="text-[15px]">
          <RefreshCw className="w-4 h-4 mr-1.5" /> Change Status
        </Button>
        <Button variant="ghost" size="sm" onClick={onClearSelection}>
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
