import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DrawerFormFooter } from '@/components/shared'
import { useCreateDisposal } from '../../hooks/useAssetMutations'
import { createDisposalSchema } from '../../schemas/assetSchemas'
import type { CreateDisposalFormData } from '../../schemas/assetSchemas'
import { TRANSFER_FIELD_OFFICES } from '../../constants/transferConstants'

const DISPOSAL_METHODS = [
  { value: 'auction',   label: 'Auction'          },
  { value: 'donation',  label: 'Donation'         },
  { value: 'scrap',     label: 'Scrap'            },
  { value: 'write-off', label: 'Write-Off'        },
  { value: 'trade-in',  label: 'Trade-In'         },
  { value: 'recycling', label: 'Recycling'        },
]

const WORKFLOW_TYPES = [
  { value: 'hq',    label: 'HQ Workflow'    },
  { value: 'field', label: 'Field Workflow' },
  { value: 'local', label: 'Local Workflow' },
]

const SURVEY_REFS = [
  'SRV-2026-0001', 'SRV-2026-0002', 'SRV-2026-0003',
  'SRV-2026-0004', 'SRV-2026-0005',
]


interface CreateDisposalDrawerProps {
  open:         boolean
  onOpenChange: (open: boolean) => void
}

export function CreateDisposalDrawer({ open, onOpenChange }: CreateDisposalDrawerProps) {
  const mutation = useCreateDisposal(() => onOpenChange(false))

  const {
    register, handleSubmit, setValue, watch, reset,
    formState: { errors },
  } = useForm<CreateDisposalFormData>({
    resolver: zodResolver(createDisposalSchema),
    defaultValues: {
      title: '', disposalMethod: '', workflowType: '', fieldOffice: '',
      justification: '', notes: '', linkedSurveyId: '', targetDisposalDate: '', recipientOrganization: '',
    },
  })

  const method = watch('disposalMethod')
  const showRecipient = method === 'donation'

  useEffect(() => {
    if (!open) reset()
  }, [open, reset])

  const onSubmit = (data: CreateDisposalFormData) => {
    mutation.mutate(data as unknown as Record<string, unknown>)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="!w-full sm:!max-w-lg flex flex-col overflow-hidden p-0">
        <SheetHeader className="px-6 py-4 border-b shrink-0">
          <SheetTitle className="text-[18px]">Create Disposal Request</SheetTitle>
          <SheetDescription className="text-[15px]">
            Submit a request to dispose of one or more assets.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 font-['Manrope']">

            {/* Disposal details */}
            <section className="space-y-4">
              <h3 className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">Disposal Details</h3>

              <div>
                <Label className="text-[15px] mb-1.5 block">Title <span className="text-destructive">*</span></Label>
                <Input {...register('title')} placeholder="e.g. Write-Off: Water-Damaged Desktop"
                  className="h-10 text-[15px]" />
                {errors.title && <p className="text-[13px] text-destructive mt-1">{errors.title.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-[15px] mb-1.5 block">Disposal Method <span className="text-destructive">*</span></Label>
                  <Select onValueChange={(v) => setValue('disposalMethod', v, { shouldValidate: true })}>
                    <SelectTrigger className="h-10 text-[15px]"><SelectValue placeholder="Select method" /></SelectTrigger>
                    <SelectContent>
                      {DISPOSAL_METHODS.map((m) => (
                        <SelectItem key={m.value} value={m.value} className="text-[15px]">{m.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.disposalMethod && <p className="text-[13px] text-destructive mt-1">{errors.disposalMethod.message}</p>}
                </div>
                <div>
                  <Label className="text-[15px] mb-1.5 block">Workflow <span className="text-destructive">*</span></Label>
                  <Select onValueChange={(v) => setValue('workflowType', v, { shouldValidate: true })}>
                    <SelectTrigger className="h-10 text-[15px]"><SelectValue placeholder="Select workflow" /></SelectTrigger>
                    <SelectContent>
                      {WORKFLOW_TYPES.map((w) => (
                        <SelectItem key={w.value} value={w.value} className="text-[15px]">{w.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.workflowType && <p className="text-[13px] text-destructive mt-1">{errors.workflowType.message}</p>}
                </div>
              </div>

              <div>
                <Label className="text-[15px] mb-1.5 block">Field Office <span className="text-destructive">*</span></Label>
                <Select onValueChange={(v) => setValue('fieldOffice', v, { shouldValidate: true })}>
                  <SelectTrigger className="h-10 text-[15px]"><SelectValue placeholder="Select office" /></SelectTrigger>
                  <SelectContent>
                    {TRANSFER_FIELD_OFFICES.map((o) => (
                      <SelectItem key={o} value={o} className="text-[15px]">{o}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.fieldOffice && <p className="text-[13px] text-destructive mt-1">{errors.fieldOffice.message}</p>}
              </div>

              {showRecipient && (
                <div>
                  <Label className="text-[15px] mb-1.5 block">Recipient Organisation</Label>
                  <Input {...register('recipientOrganization')} placeholder="e.g. Springfield Elementary School"
                    className="h-10 text-[15px]" />
                </div>
              )}
            </section>

            {/* Justification */}
            <section className="space-y-4">
              <h3 className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">Justification</h3>

              <div>
                <Label className="text-[15px] mb-1.5 block">Justification <span className="text-destructive">*</span></Label>
                <Textarea {...register('justification')} placeholder="Explain why these assets should be disposed of…"
                  rows={3} className="text-[15px]" />
                {errors.justification && <p className="text-[13px] text-destructive mt-1">{errors.justification.message}</p>}
              </div>

              <div>
                <Label className="text-[15px] mb-1.5 block">Notes</Label>
                <Textarea {...register('notes')} placeholder="Additional notes, special handling instructions…"
                  rows={2} className="text-[15px]" />
              </div>
            </section>

            {/* Links & schedule */}
            <section className="space-y-4">
              <h3 className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">Schedule & Links</h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-[15px] mb-1.5 block">Target Disposal Date <span className="text-destructive">*</span></Label>
                  <Input type="date" {...register('targetDisposalDate')} className="h-10 text-[15px]" />
                  {errors.targetDisposalDate && <p className="text-[13px] text-destructive mt-1">{errors.targetDisposalDate.message}</p>}
                </div>
                <div>
                  <Label className="text-[15px] mb-1.5 block">Link to Survey</Label>
                  <Select onValueChange={(v) => setValue('linkedSurveyId', v)}>
                    <SelectTrigger className="h-10 text-[15px]"><SelectValue placeholder="Optional" /></SelectTrigger>
                    <SelectContent>
                      {SURVEY_REFS.map((s) => (
                        <SelectItem key={s} value={s} className="text-[15px]">{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>

          </div>

          <DrawerFormFooter
            onCancel={() => onOpenChange(false)}
            submitLabel="Create Disposal Request"
            loading={mutation.isPending}
            disabled={mutation.isPending}
          />
        </form>
      </SheetContent>
    </Sheet>
  )
}
