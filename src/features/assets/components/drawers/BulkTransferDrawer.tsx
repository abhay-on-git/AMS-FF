import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRightLeft, X } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { DrawerFormFooter } from '@/components/shared'
import { bulkTransferSchema, type BulkTransferFormData } from '../../schemas/assetSchemas'
import { useBulkTransfer } from '../../hooks/useAssetMutations'

interface BulkTransferDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  assetIds: string[]
  onClearSelection?: () => void
}

const emptyValues: BulkTransferFormData = {
  destination: '',
  custodian: '',
  expectedDate: '',
  justification: '',
  notes: '',
}

const DESTINATIONS = [
  'Phnom Penh HQ',
  'Siem Reap',
  'Battambang',
  'Kampong Cham',
  'Sihanoukville',
]

const CUSTODIANS = [
  'John Smith',
  'Maria Garcia',
  'David Chen',
  'Sarah Johnson',
  'Michael Brown',
  'Emily Davis',
]

export function BulkTransferDrawer({ open, onOpenChange, assetIds, onClearSelection }: BulkTransferDrawerProps) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<BulkTransferFormData>({
    resolver: zodResolver(bulkTransferSchema),
    defaultValues: emptyValues,
  })

  const handleClose = () => {
    reset(emptyValues)
    onOpenChange(false)
  }

  const mutation = useBulkTransfer(() => {
    handleClose()
    onClearSelection?.()
  })

  const onSubmit = (data: BulkTransferFormData) => {
    mutation.mutate({ ...data, assetIds })
  }

  const displayIds = assetIds.slice(0, 5)
  const overflow = assetIds.length - displayIds.length

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="!w-full sm:!max-w-lg flex flex-col overflow-hidden p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <SheetTitle className="text-[15px] flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5" />
            Bulk Transfer Assets
          </SheetTitle>
          <SheetDescription className="text-[14px]">
            Transfer {assetIds.length} selected asset{assetIds.length !== 1 ? 's' : ''} to a new destination.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">

            {/* Selected assets summary */}
            <div className="rounded-lg border bg-muted/40 px-4 py-3 space-y-2">
              <p className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wide">
                Selected Assets ({assetIds.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {displayIds.map((id) => (
                  <Badge key={id} variant="secondary" className="text-[12px] font-mono">
                    {id}
                  </Badge>
                ))}
                {overflow > 0 && (
                  <Badge variant="outline" className="text-[12px]">
                    +{overflow} more
                  </Badge>
                )}
              </div>
            </div>

            <Separator />

            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Transfer Details
            </p>

            <div className="space-y-2">
              <Label className="text-[15px] font-medium">
                Destination <span className="text-destructive">*</span>
              </Label>
              <Select value={watch('destination')} onValueChange={(v) => setValue('destination', v)}>
                <SelectTrigger className="h-[52px] text-[15px]">
                  <SelectValue placeholder="Select destination office" />
                </SelectTrigger>
                <SelectContent>
                  {DESTINATIONS.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.destination && <p className="text-sm text-destructive">{errors.destination.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-[15px] font-medium">
                Receiving Custodian <span className="text-destructive">*</span>
              </Label>
              <Select value={watch('custodian')} onValueChange={(v) => setValue('custodian', v)}>
                <SelectTrigger className="h-[52px] text-[15px]">
                  <SelectValue placeholder="Select custodian" />
                </SelectTrigger>
                <SelectContent>
                  {CUSTODIANS.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.custodian && <p className="text-sm text-destructive">{errors.custodian.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-[15px] font-medium">Expected Transfer Date</Label>
              <Input
                {...register('expectedDate')}
                type="date"
                className="h-[52px] text-[15px]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[15px] font-medium">
                Justification <span className="text-destructive">*</span>
              </Label>
              <Textarea
                {...register('justification')}
                placeholder="Explain the reason for transferring these assets (min. 10 characters)..."
                rows={4}
                className="text-[15px] placeholder:text-[14px]"
              />
              {errors.justification && <p className="text-sm text-destructive">{errors.justification.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-[15px] font-medium">Additional Notes</Label>
              <Textarea
                {...register('notes')}
                placeholder="Any additional transfer notes or instructions..."
                rows={3}
                className="text-[15px] placeholder:text-[14px]"
              />
            </div>

          </div>

          <DrawerFormFooter
            onCancel={handleClose}
            submitLabel={`Transfer ${assetIds.length} Asset${assetIds.length !== 1 ? 's' : ''}`}
            loading={mutation.isPending}
            disabled={mutation.isPending || assetIds.length === 0}
          />
        </form>
      </SheetContent>
    </Sheet>
  )
}
