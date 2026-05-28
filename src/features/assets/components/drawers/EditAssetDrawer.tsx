import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Pencil, Info } from 'lucide-react'
import { DrawerFormFooter } from '@/components/shared'
import { editAssetSchema, type EditAssetFormData } from '../../schemas/assetSchemas'
import { useEditAsset } from '../../hooks/useAssetMutations'
import type { EnhancedAsset } from '../../types'

interface EditAssetDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  asset: EnhancedAsset | null
}

export function EditAssetDrawer({ open, onOpenChange, asset }: EditAssetDrawerProps) {
  const mutation = useEditAsset(() => onOpenChange(false))

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<EditAssetFormData>({
    resolver: zodResolver(editAssetSchema),
    values: asset ? {
      name: asset.name,
      type: asset.type,
      category: asset.category || '',
      serialNumber: asset.serialNumber,
      condition: asset.condition,
    } : undefined,
  })

  const onSubmit = (data: EditAssetFormData) => {
    if (!asset) return
    mutation.mutate({ ...data, assetId: asset.assetId })
  }

  if (!asset) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="!w-full sm:!max-w-lg flex flex-col overflow-hidden p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <SheetTitle className="text-[15px] flex items-center gap-2">
            <Pencil className="w-5 h-5" />
            Edit Asset
          </SheetTitle>
          <SheetDescription className="text-[14px]">
            Update asset information and details.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            <div className="rounded-[4px] border bg-muted/30 p-4 space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Asset ID</p>
                <p className="font-['Manrope'] font-medium">{asset.assetId}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="text-[15px] font-medium">
                Asset Name <span className="text-destructive">*</span>
              </Label>
              <Input
                {...register('name')}
                placeholder="Enter asset name"
                className="h-[52px] text-[15px] placeholder:text-[14px]"
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-[15px] font-medium">
                Type <span className="text-destructive">*</span>
              </Label>
              <Select value={watch('type')} onValueChange={(v) => setValue('type', v)}>
                <SelectTrigger className="h-[52px] text-[15px]">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
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
              <Label className="text-[15px] font-medium">Category</Label>
              <Input
                {...register('category')}
                placeholder="Enter category"
                className="h-[52px] text-[15px] placeholder:text-[14px]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[15px] font-medium">Serial Number</Label>
              <Input
                {...register('serialNumber')}
                placeholder="Enter serial number"
                className="font-['Manrope'] h-[52px] text-[15px] placeholder:text-[14px]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[15px] font-medium">Condition</Label>
              <Select value={watch('condition') || ''} onValueChange={(v) => setValue('condition', v)}>
                <SelectTrigger className="h-[52px] text-[15px]">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                  <SelectItem value="damaged">Damaged</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Changes will be recorded in the audit trail for compliance tracking.
              </AlertDescription>
            </Alert>
          </div>

          <DrawerFormFooter
            onCancel={() => onOpenChange(false)}
            submitLabel="Save Changes"
            loading={mutation.isPending}
            disabled={mutation.isPending}
          />
        </form>
      </SheetContent>
    </Sheet>
  )
}
