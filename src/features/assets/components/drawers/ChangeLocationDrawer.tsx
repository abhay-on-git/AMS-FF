import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { MapPin } from 'lucide-react'
import { DrawerFormFooter } from '@/components/shared'
import { changeLocationSchema, type ChangeLocationFormData } from '../../schemas/assetSchemas'
import { useChangeLocation } from '../../hooks/useAssetMutations'
import type { EnhancedAsset } from '../../types'

interface ChangeLocationDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  asset: EnhancedAsset | null
}

export function ChangeLocationDrawer({ open, onOpenChange, asset }: ChangeLocationDrawerProps) {
  const mutation = useChangeLocation(() => onOpenChange(false))

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ChangeLocationFormData>({
    resolver: zodResolver(changeLocationSchema),
    defaultValues: { newLocation: '', fieldOffice: '', justification: '' },
  })

  const onSubmit = (data: ChangeLocationFormData) => {
    if (!asset) return
    mutation.mutate({ ...data, assetId: asset.assetId })
  }

  if (!asset) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="!w-full sm:!max-w-lg flex flex-col overflow-hidden p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <SheetTitle className="text-15 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Change Location
          </SheetTitle>
          <SheetDescription className="text-[14px]">
            Update the physical location and field office assignment for this asset.
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
              </div>
              <p className="text-15">{asset.name}</p>
              <div className="grid grid-cols-2 gap-3 text-15">
                <div>
                  <p className="text-sm text-muted-foreground">Current Location</p>
                  <p className="font-medium">{asset.location}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Field Office</p>
                  <p className="font-medium">{asset.fieldOffice}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="text-15 font-medium">
                New Location <span className="text-destructive">*</span>
              </Label>
              <Select value={watch('newLocation')} onValueChange={(v) => setValue('newLocation', v)}>
                <SelectTrigger className="h-[52px] text-15">
                  <SelectValue placeholder="Select new location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Warehouse A — Building 1">Warehouse A — Building 1</SelectItem>
                  <SelectItem value="Warehouse B — Building 2">Warehouse B — Building 2</SelectItem>
                  <SelectItem value="Server Room — Floor 3">Server Room — Floor 3</SelectItem>
                  <SelectItem value="Main Office — Floor 1">Main Office — Floor 1</SelectItem>
                  <SelectItem value="Field Station — Remote">Field Station — Remote</SelectItem>
                  <SelectItem value="Storage Unit — Offsite">Storage Unit — Offsite</SelectItem>
                </SelectContent>
              </Select>
              {errors.newLocation && <p className="text-sm text-destructive">{errors.newLocation.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-15 font-medium">Field Office</Label>
              <Select value={watch('fieldOffice') || ''} onValueChange={(v) => setValue('fieldOffice', v)}>
                <SelectTrigger className="h-[52px] text-15">
                  <SelectValue placeholder="Select field office (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Phnom Penh HQ">Phnom Penh HQ</SelectItem>
                  <SelectItem value="Siem Reap">Siem Reap</SelectItem>
                  <SelectItem value="Battambang">Battambang</SelectItem>
                  <SelectItem value="Kampong Cham">Kampong Cham</SelectItem>
                  <SelectItem value="Sihanoukville">Sihanoukville</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="text-15 font-medium">
                Justification <span className="text-destructive">*</span>
              </Label>
              <Textarea
                {...register('justification')}
                placeholder="Provide reason for location change..."
                rows={3}
                className="text-15 placeholder:text-[14px]"
              />
              {errors.justification && <p className="text-sm text-destructive">{errors.justification.message}</p>}
            </div>
          </div>

          <DrawerFormFooter
            onCancel={() => onOpenChange(false)}
            submitLabel="Update Location"
            loading={mutation.isPending}
            disabled={mutation.isPending}
          />
        </form>
      </SheetContent>
    </Sheet>
  )
}
