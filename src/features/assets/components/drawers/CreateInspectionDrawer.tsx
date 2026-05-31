import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DrawerFormFooter } from '@/components/shared'
import { createInspectionSchema, type CreateInspectionFormData } from '../../schemas/assetSchemas'
import { useCreateInspection } from '../../hooks/useAssetMutations'
import { TRANSFER_FIELD_OFFICES, TRANSFER_CUSTODIANS } from '../../constants/transferConstants'

const INSPECTION_TYPES = [
  { value: 'scheduled',     label: 'Scheduled' },
  { value: 'spot-check',    label: 'Spot Check' },
  { value: 'pre-transfer',  label: 'Pre-Transfer' },
  { value: 'post-incident', label: 'Post-Incident' },
  { value: 'regulatory',    label: 'Regulatory' },
]

const LOCATIONS = [
  'Office Floor 1', 'Office Floor 2', 'Office A1-01', 'Office A1-02', 'Office A1-03',
  'Office A1-04', 'Office A1-05', 'Server Room B2', 'Warehouse B1', 'Warehouse B2',
  'Main Building', 'Annex A', 'Annex B', 'Field Station Alpha', 'Field Station Beta',
]

interface CreateInspectionDrawerProps {
  open:         boolean
  onOpenChange: (open: boolean) => void
}

export function CreateInspectionDrawer({ open, onOpenChange }: CreateInspectionDrawerProps) {
  const mutation = useCreateInspection(() => onOpenChange(false))

  const {
    register, handleSubmit, setValue, reset,
    formState: { errors },
  } = useForm<CreateInspectionFormData>({
    resolver: zodResolver(createInspectionSchema),
    defaultValues: { title: '', description: '', inspectionType: '', inspector: '', reviewer: '', fieldOffice: '', location: '', scheduledDate: '', dueDate: '' },
  })

  useEffect(() => {
    if (!open) reset()
  }, [open, reset])

  const onSubmit = (data: CreateInspectionFormData) => {
    mutation.mutate(data as unknown as Record<string, unknown>)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="!w-full sm:!max-w-lg flex flex-col overflow-hidden p-0">
        <SheetHeader className="px-6 py-4 border-b shrink-0">
          <SheetTitle className="text-[18px]">Schedule Inspection</SheetTitle>
          <SheetDescription className="text-15">
            Create a new asset inspection and assign it to an inspector.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 font-['Manrope']">

            {/* Inspection details */}
            <section className="space-y-4">
              <h3 className="text-13 font-semibold uppercase tracking-wide text-muted-foreground">Inspection Details</h3>

              <div>
                <Label className="text-15 mb-1.5 block">Title <span className="text-destructive">*</span></Label>
                <Input {...register('title')} placeholder="e.g. Q1 Server Room Equipment Inspection"
                  className="h-10 text-15" />
                {errors.title && <p className="text-13 text-destructive mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <Label className="text-15 mb-1.5 block">Description</Label>
                <Textarea {...register('description')} placeholder="Describe the scope and purpose of this inspection..."
                  rows={3} className="text-15" />
              </div>

              <div>
                <Label className="text-15 mb-1.5 block">Inspection Type <span className="text-destructive">*</span></Label>
                <Select onValueChange={(v) => setValue('inspectionType', v, { shouldValidate: true })}>
                  <SelectTrigger className="h-10 text-15"><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    {INSPECTION_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value} className="text-15">{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.inspectionType && <p className="text-13 text-destructive mt-1">{errors.inspectionType.message}</p>}
              </div>
            </section>

            {/* Assignment */}
            <section className="space-y-4">
              <h3 className="text-13 font-semibold uppercase tracking-wide text-muted-foreground">Assignment</h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-15 mb-1.5 block">Inspector <span className="text-destructive">*</span></Label>
                  <Select onValueChange={(v) => setValue('inspector', v, { shouldValidate: true })}>
                    <SelectTrigger className="h-10 text-15"><SelectValue placeholder="Select inspector" /></SelectTrigger>
                    <SelectContent>
                      {TRANSFER_CUSTODIANS.map((c) => (
                        <SelectItem key={c} value={c} className="text-15">{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.inspector && <p className="text-13 text-destructive mt-1">{errors.inspector.message}</p>}
                </div>
                <div>
                  <Label className="text-15 mb-1.5 block">Reviewer</Label>
                  <Select onValueChange={(v) => setValue('reviewer', v)}>
                    <SelectTrigger className="h-10 text-15"><SelectValue placeholder="Select reviewer" /></SelectTrigger>
                    <SelectContent>
                      {TRANSFER_CUSTODIANS.map((c) => (
                        <SelectItem key={c} value={c} className="text-15">{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-15 mb-1.5 block">Field Office <span className="text-destructive">*</span></Label>
                  <Select onValueChange={(v) => setValue('fieldOffice', v, { shouldValidate: true })}>
                    <SelectTrigger className="h-10 text-15"><SelectValue placeholder="Select office" /></SelectTrigger>
                    <SelectContent>
                      {TRANSFER_FIELD_OFFICES.map((o) => (
                        <SelectItem key={o} value={o} className="text-15">{o}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.fieldOffice && <p className="text-13 text-destructive mt-1">{errors.fieldOffice.message}</p>}
                </div>
                <div>
                  <Label className="text-15 mb-1.5 block">Location <span className="text-destructive">*</span></Label>
                  <Select onValueChange={(v) => setValue('location', v, { shouldValidate: true })}>
                    <SelectTrigger className="h-10 text-15"><SelectValue placeholder="Select location" /></SelectTrigger>
                    <SelectContent>
                      {LOCATIONS.map((l) => (
                        <SelectItem key={l} value={l} className="text-15">{l}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.location && <p className="text-13 text-destructive mt-1">{errors.location.message}</p>}
                </div>
              </div>
            </section>

            {/* Schedule */}
            <section className="space-y-4">
              <h3 className="text-13 font-semibold uppercase tracking-wide text-muted-foreground">Schedule</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-15 mb-1.5 block">Scheduled Date <span className="text-destructive">*</span></Label>
                  <Input type="date" {...register('scheduledDate')} className="h-10 text-15" />
                  {errors.scheduledDate && <p className="text-13 text-destructive mt-1">{errors.scheduledDate.message}</p>}
                </div>
                <div>
                  <Label className="text-15 mb-1.5 block">Due Date</Label>
                  <Input type="date" {...register('dueDate')} className="h-10 text-15" />
                </div>
              </div>
            </section>

          </div>

          <DrawerFormFooter
            onCancel={() => onOpenChange(false)}
            submitLabel="Schedule Inspection"
            loading={mutation.isPending}
            disabled={mutation.isPending}
          />
        </form>
      </SheetContent>
    </Sheet>
  )
}
