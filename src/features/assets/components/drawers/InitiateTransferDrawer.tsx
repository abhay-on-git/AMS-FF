import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, Search, X } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DrawerFormFooter } from '@/components/shared'
import { initiateTransferSchema, type InitiateTransferFormData } from '../../schemas/assetSchemas'
import { useInitiateTransfer } from '../../hooks/useAssetMutations'
import {
  TRANSFER_FIELD_OFFICES as FIELD_OFFICES,
  TRANSFER_CUSTODIANS    as CUSTODIANS,
  TRANSFER_BUILDINGS     as BUILDINGS,
  TRANSFER_ROOMS         as ROOMS,
} from '../../constants/transferConstants'
import type { TransferAssetItem } from '../../types/transferTypes'

const ELIGIBLE_ASSETS: TransferAssetItem[] = [
  { id: '1', assetId: 'LAP-001234', name: 'Dell Latitude 5520', serialNumber: 'DL5520-XR7891', type: 'Laptop', currentLocation: 'Office Floor 1', condition: 'good', acquisitionValue: 1450 },
  { id: '2', assetId: 'DES-001235', name: 'HP EliteDesk 800', serialNumber: 'HP800-QW4523', type: 'Desktop', currentLocation: 'Office A1-02', condition: 'good', acquisitionValue: 980 },
  { id: '5', assetId: 'SRV-001238', name: 'HP ProLiant DL380', serialNumber: 'HP-DL380-XK231', type: 'Server', currentLocation: 'Server Room B2', condition: 'new', acquisitionValue: 8500 },
  { id: '6', assetId: 'FUR-001239', name: 'Herman Miller Aeron Chair', serialNumber: 'HM-ERG-5541', type: 'Furniture', currentLocation: 'Office A1-05', condition: 'good', acquisitionValue: 1350 },
  { id: '7', assetId: 'NET-001240', name: 'Cisco Catalyst 9300', serialNumber: 'CS-9300-XA871', type: 'Networking', currentLocation: 'Server Room B2', condition: 'good', acquisitionValue: 4200 },
  { id: '8', assetId: 'LAP-001241', name: 'Lenovo ThinkPad T14', serialNumber: 'LN-T14-VV892', type: 'Laptop', currentLocation: 'Office Floor 2', condition: 'fair', acquisitionValue: 1200 },
]

interface InitiateTransferDrawerProps {
  open:         boolean
  onOpenChange: (open: boolean) => void
  preSelectedAssetIds?: string[]
}

export function InitiateTransferDrawer({ open, onOpenChange, preSelectedAssetIds = [] }: InitiateTransferDrawerProps) {
  const mutation = useInitiateTransfer(() => onOpenChange(false))
  const [assetSearch, setAssetSearch] = useState('')
  const [selectedAssets, setSelectedAssets] = useState<string[]>([])

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<InitiateTransferFormData>({
    resolver: zodResolver(initiateTransferSchema),
    defaultValues: { assetIds: [], reason: '', notes: '' },
  })

  const toFieldOffice  = watch('toFieldOffice')
  const toCustodian    = watch('toCustodian')

  // Auto-detect transfer type
  const FROM_OFFICE = 'Headquarters'
  const transferType = toFieldOffice && toFieldOffice !== FROM_OFFICE ? 'Inter-Field' : 'Intra-Field'

  useEffect(() => {
    if (open) {
      const ids = preSelectedAssetIds.length ? preSelectedAssetIds : []
      setSelectedAssets(ids)
      setValue('assetIds', ids)
    } else {
      reset()
      setSelectedAssets([])
      setAssetSearch('')
    }
  }, [open, preSelectedAssetIds, reset, setValue])

  const toggleAsset = (id: string) => {
    const updated = selectedAssets.includes(id)
      ? selectedAssets.filter((a) => a !== id)
      : [...selectedAssets, id]
    setSelectedAssets(updated)
    setValue('assetIds', updated, { shouldValidate: true })
  }

  const filteredAssets = ELIGIBLE_ASSETS.filter((a) =>
    !assetSearch ||
    a.name.toLowerCase().includes(assetSearch.toLowerCase()) ||
    a.assetId.toLowerCase().includes(assetSearch.toLowerCase())
  )

  const onSubmit = (data: InitiateTransferFormData) => {
    mutation.mutate(data as unknown as Record<string, unknown>)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="!w-full sm:!max-w-lg flex flex-col overflow-hidden p-0">
        <SheetHeader className="px-6 py-4 border-b shrink-0">
          <SheetTitle className="text-[18px]">Initiate Transfer</SheetTitle>
          <SheetDescription className="text-[14px]">
            Select assets and specify the destination for this transfer request.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {/* Asset picker */}
            <section>
              <Label className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground mb-2 block">
                Select Assets <span className="text-destructive">*</span>
              </Label>
              {selectedAssets.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {selectedAssets.map((id) => {
                    const asset = ELIGIBLE_ASSETS.find((a) => a.id === id)
                    if (!asset) return null
                    return (
                      <Badge key={id} variant="secondary" className="gap-1 text-[12px]">
                        {asset.assetId}
                        <button type="button" onClick={() => toggleAsset(id)} className="ml-0.5 hover:text-destructive">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    )
                  })}
                </div>
              )}
              <div className="relative mb-2">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search assets..." value={assetSearch} onChange={(e) => setAssetSearch(e.target.value)}
                  className="pl-8 h-9 text-[14px]" />
              </div>
              <div className="border rounded-[6px] max-h-[180px] overflow-y-auto">
                {filteredAssets.map((asset) => (
                  <button key={asset.id} type="button" onClick={() => toggleAsset(asset.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-muted/50 transition-colors border-b last:border-b-0 ${
                      selectedAssets.includes(asset.id) ? 'bg-brand-teal/5' : ''
                    }`}>
                    <div>
                      <p className="text-[13px] font-medium">{asset.name}</p>
                      <p className="text-[12px] text-muted-foreground">{asset.assetId} · {asset.currentLocation}</p>
                    </div>
                    {selectedAssets.includes(asset.id) && <span className="text-brand-teal text-[12px] font-medium">✓</span>}
                  </button>
                ))}
              </div>
              {errors.assetIds && <p className="text-[12px] text-destructive mt-1">{errors.assetIds.message}</p>}
            </section>

            {/* From (auto-filled, read-only) */}
            <section>
              <Label className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground mb-2 block">From (Current)</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-[6px] bg-muted/40 border text-[13px]">
                  <span className="text-muted-foreground text-[11px] block mb-0.5">Field Office</span>
                  {FROM_OFFICE}
                </div>
                <div className="p-3 rounded-[6px] bg-muted/40 border text-[13px]">
                  <span className="text-muted-foreground text-[11px] block mb-0.5">Custodian</span>
                  John Doe
                </div>
              </div>
            </section>

            {/* Arrow indicator */}
            <div className="flex items-center gap-2 text-muted-foreground text-[13px]">
              <div className="h-px flex-1 bg-border" />
              <ArrowRight className="w-4 h-4 text-brand-teal" />
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* To */}
            <section>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">To (Destination)</Label>
                {toFieldOffice && (
                  <Badge variant="outline" className={`text-[11px] ${transferType === 'Inter-Field' ? 'bg-violet-500/10 text-violet-700' : 'bg-blue-500/10 text-blue-700'}`}>
                    {transferType}
                  </Badge>
                )}
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[13px] mb-1.5 block">Field Office <span className="text-destructive">*</span></Label>
                    <Select onValueChange={(v) => setValue('toFieldOffice', v, { shouldValidate: true })}>
                      <SelectTrigger className="h-9 text-[14px]"><SelectValue placeholder="Select office" /></SelectTrigger>
                      <SelectContent>
                        {FIELD_OFFICES.map((o) => <SelectItem key={o} value={o} className="text-[14px]">{o}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    {errors.toFieldOffice && <p className="text-[12px] text-destructive mt-1">{errors.toFieldOffice.message}</p>}
                  </div>
                  <div>
                    <Label className="text-[13px] mb-1.5 block">Custodian <span className="text-destructive">*</span></Label>
                    <Select onValueChange={(v) => setValue('toCustodian', v, { shouldValidate: true })}>
                      <SelectTrigger className="h-9 text-[14px]"><SelectValue placeholder="Select custodian" /></SelectTrigger>
                      <SelectContent>
                        {CUSTODIANS.map((c) => <SelectItem key={c} value={c} className="text-[14px]">{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    {errors.toCustodian && <p className="text-[12px] text-destructive mt-1">{errors.toCustodian.message}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[13px] mb-1.5 block">Building</Label>
                    <Select onValueChange={(v) => setValue('toBuilding', v)}>
                      <SelectTrigger className="h-9 text-[14px]"><SelectValue placeholder="Optional" /></SelectTrigger>
                      <SelectContent>
                        {BUILDINGS.map((b) => <SelectItem key={b} value={b} className="text-[14px]">{b}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-[13px] mb-1.5 block">Room</Label>
                    <Select onValueChange={(v) => setValue('toRoom', v)}>
                      <SelectTrigger className="h-9 text-[14px]"><SelectValue placeholder="Optional" /></SelectTrigger>
                      <SelectContent>
                        {ROOMS.map((r) => <SelectItem key={r} value={r} className="text-[14px]">{r}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </section>

            {/* Reason */}
            <section>
              <Label className="text-[13px] mb-1.5 block">Reason <span className="text-destructive">*</span></Label>
              <Textarea {...register('reason')} placeholder="Provide a reason for this transfer (min 10 characters)..."
                rows={3} className="text-[14px]" />
              {errors.reason && <p className="text-[12px] text-destructive mt-1">{errors.reason.message}</p>}
            </section>

            {/* Notes */}
            <section>
              <Label className="text-[13px] mb-1.5 block">Additional Notes</Label>
              <Textarea {...register('notes')} placeholder="Any additional notes or handling instructions..."
                rows={2} className="text-[14px]" />
            </section>
          </div>

          <DrawerFormFooter
            onCancel={() => onOpenChange(false)}
            submitLabel={`Initiate Transfer${selectedAssets.length > 0 ? ` (${selectedAssets.length})` : ''}`}
            loading={mutation.isPending}
            disabled={mutation.isPending}
          />
        </form>
      </SheetContent>
    </Sheet>
  )
}
