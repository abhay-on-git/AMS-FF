import { useState, useEffect } from 'react'
import { useForm, type Resolver, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { DrawerFormFooter } from '@/components/shared'
import { PackagePlus, Pencil, ClipboardCheck, ChevronRight, ChevronDown, FileText, MapPin, StickyNote, DollarSign } from 'lucide-react'
import { toast } from 'sonner'
import { createAssetSchema, type CreateAssetFormData } from '../../schemas/assetSchemas'
import { useCreateAsset, useEditAsset, useRegisterFromDraft } from '../../hooks/useAssetMutations'
import {
  FIELD_OFFICES, FIELD_OFFICE_LOCATIONS, LOCATION_CUSTODIANS,
  ASSET_CONDITIONS, ASSET_TYPES, ASSET_CURRENCIES, ASSET_CLASSIFICATIONS, REGISTRATION_TIPS,
} from '../../constants/assetFormConstants'
import { emptyFormValues, fromDraftValues, toFormValues } from '../../utils/assetFormMappers'
import type { EnhancedAsset } from '../../types'
import type { DraftAsset } from '../../types/draftTypes'

// ── Props ─────────────────────────────────────────────────────────────────────

interface AssetFormDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'add' | 'edit' | 'draft'
  asset?: EnhancedAsset | null
  draft?: DraftAsset | null
}

// ── Small layout atoms ────────────────────────────────────────────────────────

function SectionHeader({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">{children}</p>
}

function FieldWrap({ label, required, error, children }: {
  label: string; required?: boolean; error?: string; children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[14px] font-medium">
        {label}{required && <span className="text-destructive ml-0.5"> *</span>}
      </Label>
      {children}
      {error && <p className="text-[12px] text-destructive">{error}</p>}
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export function AssetFormDrawer({ open, onOpenChange, mode, asset, draft }: AssetFormDrawerProps) {
  const isEdit  = mode === 'edit'
  const isDraft = mode === 'draft'
  const [procurementOpen, setProcurementOpen] = useState(false)

  const { register, handleSubmit, control, watch, reset, setValue, formState: { errors } } =
    useForm<CreateAssetFormData>({
      resolver: zodResolver(createAssetSchema) as Resolver<CreateAssetFormData>,
      defaultValues: emptyFormValues,
    })

  useEffect(() => {
    if (!open) return
    if (isDraft && draft) {
      reset(fromDraftValues(draft))
      setProcurementOpen(true)
    } else if (isEdit && asset) {
      reset(toFormValues(asset))
      setProcurementOpen(false)
    } else {
      reset(emptyFormValues)
      setProcurementOpen(false)
    }
  }, [open, isDraft, isEdit, draft, asset, reset])

  const handleClose = () => onOpenChange(false)

  const createMutation = useCreateAsset(handleClose)
  const editMutation   = useEditAsset(handleClose)
  const draftMutation  = useRegisterFromDraft(handleClose)
  const isPending = isDraft ? draftMutation.isPending : isEdit ? editMutation.isPending : createMutation.isPending

  const onSubmit = (data: CreateAssetFormData) => {
    if (isDraft && draft)     draftMutation.mutate({ ...data, draftId: draft.draftId })
    else if (isEdit && asset) editMutation.mutate({ ...data, assetId: asset.assetId })
    else                      createMutation.mutate(data)
  }

  const selectedOffice   = watch('fieldOffice')
  const selectedLocation = watch('location')
  const locationOptions  = selectedOffice   ? (FIELD_OFFICE_LOCATIONS[selectedOffice]  ?? []) : []
  const custodianOptions = selectedLocation ? (LOCATION_CUSTODIANS[selectedLocation]   ?? []) : []

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="!w-full sm:!max-w-lg flex flex-col overflow-hidden p-0">

        <SheetHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <SheetTitle className="text-[15px] flex items-center gap-2">
            {isDraft ? <ClipboardCheck className="w-5 h-5" /> : isEdit ? <Pencil className="w-5 h-5" /> : <PackagePlus className="w-5 h-5" />}
            {isDraft ? 'Complete Draft Registration' : isEdit ? 'Edit Asset' : 'Register Asset'}
          </SheetTitle>
          <SheetDescription className="text-[14px]">
            {isDraft && draft
              ? 'Complete the asset registration by filling in the remaining required fields. Draft data has been prefilled.'
              : isEdit ? 'Update asset information and details.'
              : 'Register a new asset in the system. Fill in all required fields to complete registration.'}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

            {/* IDENTIFICATION */}
            <SectionHeader>Identification</SectionHeader>
            <div className="grid grid-cols-2 gap-3">
              <FieldWrap label="Asset ID" required error={errors.assetId?.message}>
                <Input {...register('assetId')} disabled={isEdit} placeholder="e.g. LAP-001234"
                  className="h-[44px] text-[14px] placeholder:text-[13px] font-['Manrope'] disabled:opacity-60" />
              </FieldWrap>
              <FieldWrap label="EPC" required error={errors.epc?.message}>
                <Input {...register('epc')} placeholder="e.g. E280116..."
                  className="h-[44px] text-[14px] placeholder:text-[13px] font-['Manrope']" />
              </FieldWrap>
              <FieldWrap label="Barcode">
                <Input {...register('barcode')} placeholder="Enter barcode"
                  className="h-[44px] text-[14px] placeholder:text-[13px] font-['Manrope']" />
              </FieldWrap>
              <FieldWrap label="Serial Number">
                <Input {...register('serialNumber')} placeholder="e.g. SN123456"
                  className="h-[44px] text-[14px] placeholder:text-[13px] font-['Manrope']" />
              </FieldWrap>
            </div>

            <Separator />

            {/* ASSET DETAILS */}
            <SectionHeader>Asset Details</SectionHeader>
            <div className="space-y-3">
              <FieldWrap label="Name" required error={errors.name?.message}>
                <Input {...register('name')} placeholder="Enter asset name"
                  className="h-[44px] text-[14px] placeholder:text-[13px]" />
              </FieldWrap>
              <FieldWrap label="Description">
                <Textarea {...register('description')} rows={2}
                  placeholder="Brief description of the asset..."
                  className="text-[14px] placeholder:text-[13px] resize-none" />
              </FieldWrap>
              <div className="grid grid-cols-2 gap-3">
                <FieldWrap label="Category" required error={errors.type?.message}>
                  <Controller name="type" control={control} render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className={`h-[44px] text-[14px] ${errors.type ? 'border-destructive' : ''}`}>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {ASSET_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )} />
                </FieldWrap>
                <FieldWrap label="Condition">
                  <Controller name="condition" control={control} render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-[44px] text-[14px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {ASSET_CONDITIONS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )} />
                </FieldWrap>
              </div>
            </div>

            <Separator />

            {/* PROCUREMENT DETAILS — collapsible */}
            <button type="button" onClick={() => setProcurementOpen((p) => !p)}
              className="flex items-center gap-2 text-[13px] text-muted-foreground hover:text-foreground transition-colors w-full">
              <FileText className="w-4 h-4" />
              <span className="font-medium">Procurement Details</span>
              {procurementOpen
                ? <ChevronDown className="w-3.5 h-3.5 ml-auto" />
                : <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
            </button>

            {procurementOpen && (
              <div className="space-y-3 pl-1">
                <div className="grid grid-cols-2 gap-3">
                  <FieldWrap label="PO Number">
                    <Input {...register('poNumber')} placeholder="e.g. PO-4500012345"
                      className="h-[44px] text-[14px] font-['Manrope']" />
                  </FieldWrap>
                  <FieldWrap label="GRN Number">
                    <Input {...register('grnNumber')} placeholder="e.g. GRN-5000001001"
                      className="h-[44px] text-[14px] font-['Manrope']" />
                  </FieldWrap>
                </div>
                <FieldWrap label="Supplier Name">
                  <Input {...register('supplier')} placeholder="Supplier name"
                    className="h-[44px] text-[14px]" />
                </FieldWrap>
                <FieldWrap label="Acquisition Date">
                  <Input {...register('acquisitionDate')} type="date" className="h-[44px] text-[14px]" />
                </FieldWrap>

                <div className="flex items-center gap-2 pt-1 text-[13px] text-muted-foreground">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-medium">Financial Details</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <FieldWrap label="Quantity">
                    <Input {...register('quantity')} placeholder="1"
                      className="h-[44px] text-[14px] font-['Manrope']" />
                  </FieldWrap>
                  <FieldWrap label="Unit Price">
                    <Input {...register('unitPrice')} placeholder="0.00"
                      className="h-[44px] text-[14px] font-['Manrope']" />
                  </FieldWrap>
                  <FieldWrap label="Currency">
                    <Controller name="currency" control={control} render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="h-[44px] text-[14px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {ASSET_CURRENCIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    )} />
                  </FieldWrap>
                </div>
                <FieldWrap label="Total Value">
                  <Input {...register('totalValue')} placeholder="0.00"
                    className="h-[44px] text-[14px] font-['Manrope']" />
                </FieldWrap>
                <FieldWrap label="Classification">
                  <Controller name="classification" control={control} render={({ field }) => (
                    <Select value={field.value ?? ''} onValueChange={field.onChange}>
                      <SelectTrigger className="h-[44px] text-[14px]">
                        <SelectValue placeholder="Select classification" />
                      </SelectTrigger>
                      <SelectContent>
                        {ASSET_CLASSIFICATIONS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )} />
                </FieldWrap>
              </div>
            )}

            <Separator />

            {/* ASSIGNMENT */}
            <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="font-medium">Assignment</span>
            </div>
            <div className="space-y-3">
              <FieldWrap label="Field Office" required error={errors.fieldOffice?.message}>
                <Controller name="fieldOffice" control={control} render={({ field }) => (
                  <Select value={field.value} onValueChange={(v) => {
                    field.onChange(v); setValue('location', ''); setValue('custodian', '')
                  }}>
                    <SelectTrigger className={`h-[44px] text-[14px] ${errors.fieldOffice ? 'border-destructive' : ''}`}>
                      <SelectValue placeholder="Select field office" />
                    </SelectTrigger>
                    <SelectContent>
                      {FIELD_OFFICES.map((fo) => (
                        <SelectItem key={fo.code} value={fo.code}>{fo.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )} />
              </FieldWrap>
              <FieldWrap label="Location" required error={errors.location?.message}>
                <Controller name="location" control={control} render={({ field }) => (
                  <Select value={field.value}
                    onValueChange={(v) => { field.onChange(v); setValue('custodian', '') }}
                    disabled={!selectedOffice}>
                    <SelectTrigger className={`h-[44px] text-[14px] ${errors.location ? 'border-destructive' : ''}`}>
                      <SelectValue placeholder={selectedOffice ? 'Select location' : 'Select a field office first'} />
                    </SelectTrigger>
                    <SelectContent>
                      {locationOptions.map((loc) => <SelectItem key={loc} value={loc}>{loc}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )} />
                {!selectedOffice && (
                  <p className="text-[12px] text-muted-foreground">Please select a field office to view available locations</p>
                )}
              </FieldWrap>
              <FieldWrap label="Custodian">
                <Controller name="custodian" control={control} render={({ field }) => (
                  <Select value={field.value ?? ''} onValueChange={field.onChange} disabled={!selectedLocation}>
                    <SelectTrigger className="h-[44px] text-[14px]">
                      <SelectValue placeholder={selectedLocation ? 'Select custodian' : 'Select a location first'} />
                    </SelectTrigger>
                    <SelectContent>
                      {custodianOptions.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )} />
                {!selectedLocation && (
                  <p className="text-[12px] text-muted-foreground">Please select a location to view available custodians</p>
                )}
              </FieldWrap>
            </div>

            <Separator />

            {/* ADDITIONAL NOTES */}
            <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
              <StickyNote className="w-4 h-4" />
              <span className="font-medium">Additional Notes</span>
            </div>
            <Textarea {...register('notes')} rows={3}
              placeholder="Add any additional notes about this asset..."
              className="text-[14px] placeholder:text-[13px]" />

            {/* REGISTRATION TIPS — draft mode only */}
            {isDraft && (
              <div className="rounded-lg bg-muted/50 border px-4 py-3 text-[13px] text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground mb-2">Registration Tips</p>
                {REGISTRATION_TIPS.map((tip) => <p key={tip}>- {tip}</p>)}
              </div>
            )}

          </div>

          {/* FOOTER */}
          {isDraft ? (
            <div className="border-t px-6 py-4 shrink-0 bg-background flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleClose} className="text-[14px]">Cancel</Button>
              <Button type="button" variant="outline" disabled={isPending} className="text-[14px]"
                onClick={() => toast.info('Draft progress saved')}>
                Save Draft
              </Button>
              <Button type="submit" disabled={isPending}
                className="text-[14px] bg-brand-navy hover:bg-brand-navy-mid text-white">
                {isPending ? 'Publishing...' : 'Complete & Publish'}
              </Button>
            </div>
          ) : (
            <DrawerFormFooter
              onCancel={handleClose}
              submitLabel={isEdit ? 'Save Changes' : 'Register Asset'}
              loading={isPending}
              disabled={isPending}
            />
          )}
        </form>
      </SheetContent>
    </Sheet>
  )
}
