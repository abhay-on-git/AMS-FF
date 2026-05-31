import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { ArrowRightLeft, Info } from 'lucide-react'
import { DrawerFormFooter } from '@/components/shared'
import { transferAssetSchema, type TransferAssetFormData } from '../../schemas/assetSchemas'
import { useTransferAsset } from '../../hooks/useAssetMutations'
import { getStatusColor } from '../../utils'
import type { EnhancedAsset } from '../../types'

interface TransferAssetDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  asset: EnhancedAsset | null
}

export function TransferAssetDrawer({ open, onOpenChange, asset }: TransferAssetDrawerProps) {
  const mutation = useTransferAsset(() => onOpenChange(false))

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<TransferAssetFormData>({
    resolver: zodResolver(transferAssetSchema),
    defaultValues: { destination: '', custodian: '', justification: '' },
  })

  const onSubmit = (data: TransferAssetFormData) => {
    if (!asset) return
    mutation.mutate({ ...data, assetId: asset.assetId })
  }

  if (!asset) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="!w-full sm:!max-w-lg flex flex-col overflow-hidden p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <SheetTitle className="text-15 flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5" />
            Transfer Asset
          </SheetTitle>
          <SheetDescription className="text-[14px]">
            Initiate an asset transfer to a different office, location, or custodian.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            <div className="rounded-[4px] border bg-muted/30 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Asset</p>
                  <p className="font-['Manrope'] font-medium">{asset.assetId}</p>
                </div>
                <Badge className={getStatusColor(asset.status)}>
                  {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
                </Badge>
              </div>
              <p className="text-15">{asset.name}</p>
              <div className="grid grid-cols-2 gap-3 text-15">
                <div>
                  <p className="text-sm text-muted-foreground">Current Location</p>
                  <p>{asset.location}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Custodian</p>
                  <p>{asset.responsiblePerson}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="text-15 font-medium">
                Destination Office <span className="text-destructive">*</span>
              </Label>
              <Select value={watch('destination')} onValueChange={(v) => setValue('destination', v)}>
                <SelectTrigger className="h-[52px] text-15">
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Phnom Penh HQ">Phnom Penh HQ</SelectItem>
                  <SelectItem value="Siem Reap Office">Siem Reap Office</SelectItem>
                  <SelectItem value="Battambang Office">Battambang Office</SelectItem>
                  <SelectItem value="Kampong Cham Office">Kampong Cham Office</SelectItem>
                  <SelectItem value="Sihanoukville Office">Sihanoukville Office</SelectItem>
                </SelectContent>
              </Select>
              {errors.destination && <p className="text-sm text-destructive">{errors.destination.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-15 font-medium">
                Receiving Custodian <span className="text-destructive">*</span>
              </Label>
              <Select value={watch('custodian')} onValueChange={(v) => setValue('custodian', v)}>
                <SelectTrigger className="h-[52px] text-15">
                  <SelectValue placeholder="Select custodian" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nguyen Van A">Nguyen Van A</SelectItem>
                  <SelectItem value="Tran Thi B">Tran Thi B</SelectItem>
                  <SelectItem value="Le Van C">Le Van C</SelectItem>
                  <SelectItem value="Pham Thi D">Pham Thi D</SelectItem>
                  <SelectItem value="Hoang Van E">Hoang Van E</SelectItem>
                </SelectContent>
              </Select>
              {errors.custodian && <p className="text-sm text-destructive">{errors.custodian.message}</p>}
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="text-15 font-medium">
                Transfer Justification <span className="text-destructive">*</span>
              </Label>
              <Textarea
                {...register('justification')}
                placeholder="Reason for transfer (e.g., operational reallocation, project reassignment)..."
                rows={4}
                className="text-15 placeholder:text-[14px]"
              />
              {errors.justification && <p className="text-sm text-destructive">{errors.justification.message}</p>}
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                The asset status will change to <span className="font-medium">In Transit</span> until the receiving office confirms receipt.
              </AlertDescription>
            </Alert>
          </div>

          <DrawerFormFooter
            onCancel={() => onOpenChange(false)}
            submitLabel="Submit Transfer"
            loading={mutation.isPending}
            disabled={mutation.isPending}
          />
        </form>
      </SheetContent>
    </Sheet>
  )
}
