import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DrawerFormFooter } from '@/components/shared'
import { useCreateSurvey } from '../../hooks/useAssetMutations'
import { createSurveySchema } from '../../schemas/assetSchemas'
import type { CreateSurveyFormData } from '../../schemas/assetSchemas'
import { TRANSFER_FIELD_OFFICES, TRANSFER_CUSTODIANS } from '../../constants/transferConstants'

const SURVEY_TYPES = [
  { value: 'full-count',      label: 'Full Count'       },
  { value: 'sample-based',    label: 'Sample-Based'     },
  { value: 'location-based',  label: 'Location-Based'   },
  { value: 'custodian-based', label: 'Custodian-Based'  },
  { value: 'high-value',      label: 'High-Value (>$5k)'},
]

const WORKFLOW_TYPES = [
  { value: 'hq',    label: 'HQ Workflow'    },
  { value: 'field', label: 'Field Workflow' },
  { value: 'local', label: 'Local Workflow' },
]

const LOCATIONS = [
  'Office Floor 1', 'Office Floor 2', 'Server Room B2', 'Warehouse B1',
  'Warehouse B2', 'Main Building', 'Annex A', 'Annex B', 'Field Station Alpha',
]


interface CreateSurveyDrawerProps {
  open:         boolean
  onOpenChange: (open: boolean) => void
}

export function CreateSurveyDrawer({ open, onOpenChange }: CreateSurveyDrawerProps) {
  const mutation = useCreateSurvey(() => onOpenChange(false))

  const {
    register, handleSubmit, setValue, reset,
    formState: { errors },
  } = useForm<CreateSurveyFormData>({
    resolver: zodResolver(createSurveySchema),
    defaultValues: {
      title: '', description: '', scope: '', surveyType: '', workflowType: '',
      surveyTeamLead: '', fieldOffice: '', targetLocations: '', plannedStartDate: '', plannedEndDate: '',
    },
  })

  useEffect(() => {
    if (!open) reset()
  }, [open, reset])

  const onSubmit = (data: CreateSurveyFormData) => {
    mutation.mutate(data as unknown as Record<string, unknown>)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="!w-full sm:!max-w-lg flex flex-col overflow-hidden p-0">
        <SheetHeader className="px-6 py-4 border-b shrink-0">
          <SheetTitle className="text-[18px]">Create Survey</SheetTitle>
          <SheetDescription className="text-[15px]">
            Plan and schedule a new physical asset survey.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 font-['Manrope']">

            {/* Survey details */}
            <section className="space-y-4">
              <h3 className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">Survey Details</h3>

              <div>
                <Label className="text-[15px] mb-1.5 block">Title <span className="text-destructive">*</span></Label>
                <Input {...register('title')} placeholder="e.g. Annual Full Physical Count — HQ IT Assets"
                  className="h-10 text-[15px]" />
                {errors.title && <p className="text-[13px] text-destructive mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <Label className="text-[15px] mb-1.5 block">Description</Label>
                <Textarea {...register('description')} placeholder="Purpose and objectives of this survey…"
                  rows={2} className="text-[15px]" />
              </div>

              <div>
                <Label className="text-[15px] mb-1.5 block">Scope <span className="text-destructive">*</span></Label>
                <Textarea {...register('scope')} placeholder="Define which assets are in scope (categories, locations, value threshold…)"
                  rows={2} className="text-[15px]" />
                {errors.scope && <p className="text-[13px] text-destructive mt-1">{errors.scope.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-[15px] mb-1.5 block">Survey Type <span className="text-destructive">*</span></Label>
                  <Select onValueChange={(v) => setValue('surveyType', v, { shouldValidate: true })}>
                    <SelectTrigger className="h-10 text-[15px]"><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      {SURVEY_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value} className="text-[15px]">{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.surveyType && <p className="text-[13px] text-destructive mt-1">{errors.surveyType.message}</p>}
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
            </section>

            {/* Assignment */}
            <section className="space-y-4">
              <h3 className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">Assignment</h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-[15px] mb-1.5 block">Team Lead <span className="text-destructive">*</span></Label>
                  <Select onValueChange={(v) => setValue('surveyTeamLead', v, { shouldValidate: true })}>
                    <SelectTrigger className="h-10 text-[15px]"><SelectValue placeholder="Select team lead" /></SelectTrigger>
                    <SelectContent>
                      {TRANSFER_CUSTODIANS.map((c) => (
                        <SelectItem key={c} value={c} className="text-[15px]">{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.surveyTeamLead && <p className="text-[13px] text-destructive mt-1">{errors.surveyTeamLead.message}</p>}
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
              </div>

              <div>
                <Label className="text-[15px] mb-1.5 block">Target Locations <span className="text-destructive">*</span></Label>
                <Select onValueChange={(v) => setValue('targetLocations', v, { shouldValidate: true })}>
                  <SelectTrigger className="h-10 text-[15px]"><SelectValue placeholder="Select primary location" /></SelectTrigger>
                  <SelectContent>
                    {LOCATIONS.map((l) => (
                      <SelectItem key={l} value={l} className="text-[15px]">{l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.targetLocations && <p className="text-[13px] text-destructive mt-1">{errors.targetLocations.message}</p>}
              </div>
            </section>

            {/* Schedule */}
            <section className="space-y-4">
              <h3 className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">Schedule</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-[15px] mb-1.5 block">Start Date <span className="text-destructive">*</span></Label>
                  <Input type="date" {...register('plannedStartDate')} className="h-10 text-[15px]" />
                  {errors.plannedStartDate && <p className="text-[13px] text-destructive mt-1">{errors.plannedStartDate.message}</p>}
                </div>
                <div>
                  <Label className="text-[15px] mb-1.5 block">End Date</Label>
                  <Input type="date" {...register('plannedEndDate')} className="h-10 text-[15px]" />
                </div>
              </div>
            </section>

          </div>

          <DrawerFormFooter
            onCancel={() => onOpenChange(false)}
            submitLabel="Create Survey"
            loading={mutation.isPending}
            disabled={mutation.isPending}
          />
        </form>
      </SheetContent>
    </Sheet>
  )
}
