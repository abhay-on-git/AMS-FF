import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash2, AlertTriangle } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { DrawerFormFooter } from '@/components/shared'
import { bulkDisposalSchema, type BulkDisposalFormData } from '../../schemas/assetSchemas'
import { useBulkDisposal } from '../../hooks/useAssetMutations'

interface BulkDisposalDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  assetIds: string[]
  onClearSelection?: () => void
}

const emptyValues: BulkDisposalFormData = {
  disposalMethod: '',
  disposalDate: '',
  authorizedBy: '',
  estimatedValue: '',
  reason: '',
  notes: '',
}

const DISPOSAL_METHODS = ['Sale', 'Donation', 'Scrap', 'Write-off', 'Return to Supplier']

export function BulkDisposalDrawer({ open, onOpenChange, assetIds, onClearSelection }: BulkDisposalDrawerProps) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<BulkDisposalFormData>({
    resolver: zodResolver(bulkDisposalSchema),
    defaultValues: emptyValues,
  })

  const handleClose = () => { reset(emptyValues); onOpenChange(false) }

  const mutation = useBulkDisposal(() => { handleClose(); onClearSelection?.() })

  const onSubmit = (data: BulkDisposalFormData) => mutation.mutate({ ...data, assetIds })

  const displayIds = assetIds.slice(0, 5)
  const overflow = assetIds.length - displayIds.length

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="!w-full sm:!max-w-lg flex flex-col overflow-hidden p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <SheetTitle className="text-15 flex items-center gap-2">
            <Trash2 className="w-5 h-5" />
            Bulk Disposal
          </SheetTitle>
          <SheetDescription className="text-[14px]">
            Dispose of {assetIds.length} selected asset{assetIds.length !== 1 ? 's' : ''}.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">

            {/* Warning banner */}
            <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
              <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
              <p className="text-13 text-destructive leading-snug">
                This action cannot be undone. Assets will be marked as disposed.
              </p>
            </div>

            {/* Selected assets summary */}
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

            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Disposal Details</p>

            <div className="space-y-2">
              <Label className="text-15 font-medium">Disposal Method <span className="text-destructive">*</span></Label>
              <Select value={watch('disposalMethod')} onValueChange={(v) => setValue('disposalMethod', v)}>
                <SelectTrigger className="h-[52px] text-15"><SelectValue placeholder="Select disposal method" /></SelectTrigger>
                <SelectContent>
                  {DISPOSAL_METHODS.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.disposalMethod && <p className="text-sm text-destructive">{errors.disposalMethod.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-15 font-medium">Disposal Date <span className="text-destructive">*</span></Label>
              <Input {...register('disposalDate')} type="date" className="h-[52px] text-15" />
              {errors.disposalDate && <p className="text-sm text-destructive">{errors.disposalDate.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-15 font-medium">Authorized By <span className="text-destructive">*</span></Label>
              <Input {...register('authorizedBy')} placeholder="Enter authorizing officer name" className="h-[52px] text-15 placeholder:text-[14px]" />
              {errors.authorizedBy && <p className="text-sm text-destructive">{errors.authorizedBy.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-15 font-medium">Estimated Value (USD)</Label>
              <Input {...register('estimatedValue')} placeholder="e.g. 1500.00" className="h-[52px] text-15 placeholder:text-[14px]" />
            </div>

            <div className="space-y-2">
              <Label className="text-15 font-medium">Reason <span className="text-destructive">*</span></Label>
              <Textarea
                {...register('reason')}
                placeholder="Explain the reason for disposing these assets (min. 10 characters)..."
                rows={4}
                className="text-15 placeholder:text-[14px]"
              />
              {errors.reason && <p className="text-sm text-destructive">{errors.reason.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-15 font-medium">Additional Notes</Label>
              <Textarea {...register('notes')} placeholder="Any additional notes..." rows={3} className="text-15 placeholder:text-[14px]" />
            </div>
          </div>

          <DrawerFormFooter
            onCancel={handleClose}
            submitLabel={`Dispose ${assetIds.length} Asset${assetIds.length !== 1 ? 's' : ''}`}
            loading={mutation.isPending}
            disabled={mutation.isPending || assetIds.length === 0}
          />
        </form>
      </SheetContent>
    </Sheet>
  )
}
