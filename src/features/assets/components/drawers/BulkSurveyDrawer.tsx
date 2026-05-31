import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ScanSearch } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { DrawerFormFooter } from '@/components/shared'
import { bulkSurveySchema, type BulkSurveyFormData } from '../../schemas/assetSchemas'
import { useBulkSurvey } from '../../hooks/useAssetMutations'

interface BulkSurveyDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  assetIds: string[]
  onClearSelection?: () => void
}

const emptyValues: BulkSurveyFormData = {
  surveyType: '',
  scheduledDate: '',
  assignedTo: '',
  notes: '',
}

export function BulkSurveyDrawer({ open, onOpenChange, assetIds, onClearSelection }: BulkSurveyDrawerProps) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<BulkSurveyFormData>({
    resolver: zodResolver(bulkSurveySchema),
    defaultValues: emptyValues,
  })

  const handleClose = () => { reset(emptyValues); onOpenChange(false) }

  const mutation = useBulkSurvey(() => { handleClose(); onClearSelection?.() })

  const onSubmit = (data: BulkSurveyFormData) => mutation.mutate({ ...data, assetIds })

  const displayIds = assetIds.slice(0, 5)
  const overflow = assetIds.length - displayIds.length

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="!w-full sm:!max-w-lg flex flex-col overflow-hidden p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <SheetTitle className="text-[15px] flex items-center gap-2">
            <ScanSearch className="w-5 h-5" />
            Schedule Bulk Survey
          </SheetTitle>
          <SheetDescription className="text-[14px]">
            Schedule a survey for {assetIds.length} selected asset{assetIds.length !== 1 ? 's' : ''}.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            <div className="rounded-lg border bg-muted/40 px-4 py-3 space-y-2">
              <p className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wide">
                Selected Assets ({assetIds.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {displayIds.map((id) => (
                  <Badge key={id} variant="secondary" className="text-[12px] font-mono">{id}</Badge>
                ))}
                {overflow > 0 && (
                  <Badge variant="outline" className="text-[12px]">+{overflow} more</Badge>
                )}
              </div>
            </div>

            <Separator />

            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Survey Details</p>

            <div className="space-y-2">
              <Label className="text-[15px] font-medium">Survey Type <span className="text-destructive">*</span></Label>
              <Select value={watch('surveyType')} onValueChange={(v) => setValue('surveyType', v)}>
                <SelectTrigger className="h-[52px] text-[15px]"><SelectValue placeholder="Select survey type" /></SelectTrigger>
                <SelectContent>
                  {['Physical', 'Condition', 'Valuation', 'Audit'].map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.surveyType && <p className="text-sm text-destructive">{errors.surveyType.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-[15px] font-medium">Scheduled Date <span className="text-destructive">*</span></Label>
              <Input {...register('scheduledDate')} type="date" className="h-[52px] text-[15px]" />
              {errors.scheduledDate && <p className="text-sm text-destructive">{errors.scheduledDate.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-[15px] font-medium">Assigned To <span className="text-destructive">*</span></Label>
              <Input {...register('assignedTo')} placeholder="Enter assignee name" className="h-[52px] text-[15px] placeholder:text-[14px]" />
              {errors.assignedTo && <p className="text-sm text-destructive">{errors.assignedTo.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-[15px] font-medium">Notes</Label>
              <Textarea {...register('notes')} placeholder="Any additional notes..." rows={3} className="text-[15px] placeholder:text-[14px]" />
            </div>
          </div>

          <DrawerFormFooter
            onCancel={handleClose}
            submitLabel={`Schedule Survey for ${assetIds.length} Asset${assetIds.length !== 1 ? 's' : ''}`}
            loading={mutation.isPending}
            disabled={mutation.isPending || assetIds.length === 0}
          />
        </form>
      </SheetContent>
    </Sheet>
  )
}
