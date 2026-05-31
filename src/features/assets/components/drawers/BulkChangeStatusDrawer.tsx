import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { RefreshCw } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { DrawerFormFooter } from '@/components/shared'
import { bulkChangeStatusSchema, type BulkChangeStatusFormData } from '../../schemas/assetSchemas'
import { useBulkChangeStatus } from '../../hooks/useAssetMutations'

interface BulkChangeStatusDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  assetIds: string[]
  onClearSelection?: () => void
}

const emptyValues: BulkChangeStatusFormData = {
  newStatus: '',
  reason: '',
  effectiveDate: '',
  notes: '',
}

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'missing', label: 'Missing' },
  { value: 'in-transit', label: 'In Transit' },
]

export function BulkChangeStatusDrawer({ open, onOpenChange, assetIds, onClearSelection }: BulkChangeStatusDrawerProps) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<BulkChangeStatusFormData>({
    resolver: zodResolver(bulkChangeStatusSchema),
    defaultValues: emptyValues,
  })

  const handleClose = () => { reset(emptyValues); onOpenChange(false) }

  const mutation = useBulkChangeStatus(() => { handleClose(); onClearSelection?.() })

  const onSubmit = (data: BulkChangeStatusFormData) => mutation.mutate({ ...data, assetIds })

  const displayIds = assetIds.slice(0, 5)
  const overflow = assetIds.length - displayIds.length

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="!w-full sm:!max-w-lg flex flex-col overflow-hidden p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <SheetTitle className="text-15 flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            Bulk Change Status
          </SheetTitle>
          <SheetDescription className="text-[14px]">
            Update the status of {assetIds.length} selected asset{assetIds.length !== 1 ? 's' : ''}.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            <div className="rounded-lg border bg-muted/40 px-4 py-3 space-y-2">
              <p className="text-13 font-semibold text-muted-foreground uppercase tracking-wide">
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

            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Status Update</p>

            <div className="space-y-2">
              <Label className="text-15 font-medium">New Status <span className="text-destructive">*</span></Label>
              <Select value={watch('newStatus')} onValueChange={(v) => setValue('newStatus', v)}>
                <SelectTrigger className="h-[52px] text-15"><SelectValue placeholder="Select new status" /></SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.newStatus && <p className="text-sm text-destructive">{errors.newStatus.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-15 font-medium">
                Reason <span className="text-destructive">*</span>
              </Label>
              <Textarea
                {...register('reason')}
                placeholder="Explain the reason for this status change (min. 10 characters)..."
                rows={4}
                className="text-15 placeholder:text-[14px]"
              />
              {errors.reason && <p className="text-sm text-destructive">{errors.reason.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-15 font-medium">Effective Date</Label>
              <Input {...register('effectiveDate')} type="date" className="h-[52px] text-15" />
            </div>

            <div className="space-y-2">
              <Label className="text-15 font-medium">Additional Notes</Label>
              <Textarea {...register('notes')} placeholder="Any additional notes..." rows={3} className="text-15 placeholder:text-[14px]" />
            </div>
          </div>

          <DrawerFormFooter
            onCancel={handleClose}
            submitLabel={`Update Status for ${assetIds.length} Asset${assetIds.length !== 1 ? 's' : ''}`}
            loading={mutation.isPending}
            disabled={mutation.isPending || assetIds.length === 0}
          />
        </form>
      </SheetContent>
    </Sheet>
  )
}
