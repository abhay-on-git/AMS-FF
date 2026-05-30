import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { PackagePlus, Pencil } from 'lucide-react'
import { DrawerFormFooter } from '@/components/shared'
import { createAssetSchema, type CreateAssetFormData } from '../../schemas/assetSchemas'
import { useCreateAsset, useEditAsset } from '../../hooks/useAssetMutations'
import type { EnhancedAsset } from '../../types'

interface AssetFormDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'add' | 'edit'
  asset?: EnhancedAsset | null
}

const emptyValues: CreateAssetFormData = {
  assetId: '', epc: '', type: '', name: '', fieldOffice: '', location: '',
  barcode: '', description: '', responsiblePerson: '', serialNumber: '',
  condition: 'good', status: 'active', poNumber: '', grnNumber: '',
  supplier: '', acquisitionDate: '', quantity: '1', unitPrice: '',
  currency: 'USD', totalValue: '', notes: '',
}

function toFormValues(asset: EnhancedAsset): CreateAssetFormData {
  return {
    assetId: asset.assetId,
    epc: asset.epc,
    type: asset.type,
    name: asset.name,
    fieldOffice: asset.fieldOffice,
    location: asset.location,
    barcode: asset.barcode ?? '',
    description: asset.description ?? '',
    responsiblePerson: asset.responsiblePerson ?? '',
    serialNumber: asset.serialNumber ?? '',
    condition: asset.condition,
    status: asset.status,
    poNumber: asset.poNumber ?? '',
    grnNumber: asset.grnNumber ?? '',
    supplier: '',
    acquisitionDate: asset.acquisitionDate ?? '',
    quantity: '1',
    unitPrice: '',
    currency: asset.currency ?? 'USD',
    totalValue: '',
    notes: asset.notes ?? '',
  }
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{children}</p>
}

export function AssetFormDrawer({ open, onOpenChange, mode, asset }: AssetFormDrawerProps) {
  const isEdit = mode === 'edit'

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<CreateAssetFormData>({
    resolver: zodResolver(createAssetSchema),
    values: isEdit && asset ? toFormValues(asset) : undefined,
    defaultValues: emptyValues,
  })

  const handleClose = () => { reset(emptyValues); onOpenChange(false) }

  const createMutation = useCreateAsset(handleClose)
  const editMutation = useEditAsset(handleClose)
  const isPending = isEdit ? editMutation.isPending : createMutation.isPending

  const onSubmit = (data: CreateAssetFormData) => {
    if (isEdit && asset) {
      editMutation.mutate({ ...data, assetId: asset.assetId })
    } else {
      createMutation.mutate(data)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="!w-full sm:!max-w-lg flex flex-col overflow-hidden p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <SheetTitle className="text-[15px] flex items-center gap-2">
            {isEdit ? <Pencil className="w-5 h-5" /> : <PackagePlus className="w-5 h-5" />}
            {isEdit ? 'Edit Asset' : 'Register Asset'}
          </SheetTitle>
          <SheetDescription className="text-[14px]">
            {isEdit
              ? 'Update asset information and details.'
              : 'Register a new asset in the system. Fill in all required fields to complete registration.'}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            <SectionTitle>Asset Identification</SectionTitle>

            <div className="space-y-2">
              <Label className="text-[15px] font-medium">Asset ID <span className="text-destructive">*</span></Label>
              <Input {...register('assetId')} placeholder="e.g. LAP-001234" disabled={isEdit} className="h-[52px] text-[15px] placeholder:text-[14px] font-['Manrope'] disabled:opacity-60" />
              {errors.assetId && <p className="text-sm text-destructive">{errors.assetId.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-[15px] font-medium">EPC <span className="text-destructive">*</span></Label>
              <Input {...register('epc')} placeholder="e.g. E280116060000204..." className="h-[52px] text-[15px] placeholder:text-[14px] font-['Manrope']" />
              {errors.epc && <p className="text-sm text-destructive">{errors.epc.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-[15px] font-medium">Barcode</Label>
              <Input {...register('barcode')} placeholder="Enter barcode" className="h-[52px] text-[15px] placeholder:text-[14px] font-['Manrope']" />
            </div>

            <div className="space-y-2">
              <Label className="text-[15px] font-medium">Type <span className="text-destructive">*</span></Label>
              <Select value={watch('type')} onValueChange={(v) => setValue('type', v)}>
                <SelectTrigger className="h-[52px] text-[15px]"><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Equipment">Equipment</SelectItem>
                  <SelectItem value="Vehicle">Vehicle</SelectItem>
                  <SelectItem value="Furniture">Furniture</SelectItem>
                  <SelectItem value="IT Hardware">IT Hardware</SelectItem>
                  <SelectItem value="Tools">Tools</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && <p className="text-sm text-destructive">{errors.type.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-[15px] font-medium">Name <span className="text-destructive">*</span></Label>
              <Input {...register('name')} placeholder="Enter asset name" className="h-[52px] text-[15px] placeholder:text-[14px]" />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-[15px] font-medium">Description</Label>
              <Textarea {...register('description')} placeholder="Brief description of the asset..." rows={3} className="text-[15px] placeholder:text-[14px]" />
            </div>

            <Separator />

            <SectionTitle>Assignment & Details</SectionTitle>

            <div className="space-y-2">
              <Label className="text-[15px] font-medium">Field Office <span className="text-destructive">*</span></Label>
              <Select value={watch('fieldOffice')} onValueChange={(v) => setValue('fieldOffice', v)}>
                <SelectTrigger className="h-[52px] text-[15px]"><SelectValue placeholder="Select field office" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Phnom Penh HQ">Phnom Penh HQ</SelectItem>
                  <SelectItem value="Siem Reap">Siem Reap</SelectItem>
                  <SelectItem value="Battambang">Battambang</SelectItem>
                  <SelectItem value="Kampong Cham">Kampong Cham</SelectItem>
                  <SelectItem value="Sihanoukville">Sihanoukville</SelectItem>
                </SelectContent>
              </Select>
              {errors.fieldOffice && <p className="text-sm text-destructive">{errors.fieldOffice.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-[15px] font-medium">Location <span className="text-destructive">*</span></Label>
              <Select value={watch('location')} onValueChange={(v) => setValue('location', v)}>
                <SelectTrigger className="h-[52px] text-[15px]"><SelectValue placeholder="Select location" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Warehouse A — Building 1">Warehouse A — Building 1</SelectItem>
                  <SelectItem value="Warehouse B — Building 2">Warehouse B — Building 2</SelectItem>
                  <SelectItem value="Server Room — Floor 3">Server Room — Floor 3</SelectItem>
                  <SelectItem value="Main Office — Floor 1">Main Office — Floor 1</SelectItem>
                  <SelectItem value="Field Station — Remote">Field Station — Remote</SelectItem>
                  <SelectItem value="Storage Unit — Offsite">Storage Unit — Offsite</SelectItem>
                </SelectContent>
              </Select>
              {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-[15px] font-medium">Responsible Person</Label>
              <Input {...register('responsiblePerson')} placeholder="Enter custodian name" className="h-[52px] text-[15px] placeholder:text-[14px]" />
            </div>

            <div className="space-y-2">
              <Label className="text-[15px] font-medium">Condition</Label>
              <Select value={watch('condition')} onValueChange={(v) => setValue('condition', v)}>
                <SelectTrigger className="h-[52px] text-[15px]"><SelectValue placeholder="Select condition" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                  <SelectItem value="damaged">Damaged</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[15px] font-medium">Serial Number</Label>
              <Input {...register('serialNumber')} placeholder="Enter serial number" className="h-[52px] text-[15px] placeholder:text-[14px] font-['Manrope']" />
            </div>

            <div className="space-y-2">
              <Label className="text-[15px] font-medium">PO Number</Label>
              <Input {...register('poNumber')} placeholder="e.g. PO-2024-0012" className="h-[52px] text-[15px] placeholder:text-[14px] font-['Manrope']" />
            </div>

            <div className="space-y-2">
              <Label className="text-[15px] font-medium">Acquisition Date</Label>
              <Input {...register('acquisitionDate')} type="date" className="h-[52px] text-[15px]" />
            </div>

            <div className="space-y-2">
              <Label className="text-[15px] font-medium">Notes</Label>
              <Textarea {...register('notes')} placeholder="Any additional notes..." rows={3} className="text-[15px] placeholder:text-[14px]" />
            </div>
          </div>

          <DrawerFormFooter
            onCancel={handleClose}
            submitLabel={isEdit ? 'Save Changes' : 'Register Asset'}
            loading={isPending}
            disabled={isPending}
          />
        </form>
      </SheetContent>
    </Sheet>
  )
}
