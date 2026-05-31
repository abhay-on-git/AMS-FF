import { useEffect, useState, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { PREDEFINED_REPORTS } from '../constants/reportingData'
import { useCreateSchedule, useUpdateSchedule } from '../hooks/useReportsMutations'
import type { CreateSchedulePayload, ScheduledReport } from '../types'

interface ScheduleFormDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  schedule: ScheduledReport | null
}

const emptyForm: CreateSchedulePayload = {
  name: '',
  reportType: 'asset-register-location',
  frequency: 'monthly',
  recipients: [],
  format: 'excel',
}

export function ScheduleFormDrawer({ open, onOpenChange, schedule }: ScheduleFormDrawerProps) {
  const create = useCreateSchedule(() => onOpenChange(false))
  const update = useUpdateSchedule(() => onOpenChange(false))
  const [form, setForm] = useState(emptyForm)
  const [recipientsText, setRecipientsText] = useState('')

  useEffect(() => {
    if (!open) return
    if (schedule) {
      setForm({
        name: schedule.name,
        reportType: schedule.reportType,
        frequency: schedule.frequency,
        recipients: schedule.recipients,
        format: schedule.format,
      })
      setRecipientsText(schedule.recipients.join(', '))
    } else {
      setForm(emptyForm)
      setRecipientsText('')
    }
  }, [open, schedule])

  const submit = () => {
    const recipients = recipientsText.split(',').map((e) => e.trim()).filter(Boolean)
    if (!form.name.trim() || recipients.length === 0) return
    const payload = { ...form, recipients }
    if (schedule) update.mutate({ id: schedule.id, data: payload })
    else create.mutate(payload)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col overflow-hidden sm:max-w-xl">
        <SheetHeader>
          <SheetTitle className="text-xl">{schedule ? 'Edit Schedule' : 'Create New Schedule'}</SheetTitle>
          <SheetDescription className="text-base">Set up automated report delivery via email.</SheetDescription>
        </SheetHeader>
        <div className="flex-1 space-y-5 overflow-y-auto px-1 py-4">
          <Field label="Schedule Name" required>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-12 text-base" />
          </Field>
          <Field label="Report Type" required>
            <Select value={form.reportType} onValueChange={(v) => setForm({ ...form, reportType: v })}>
              <SelectTrigger className="h-12 text-base"><SelectValue /></SelectTrigger>
              <SelectContent>
                {PREDEFINED_REPORTS.map((r) => (
                  <SelectItem key={r.id} value={r.id} className="text-base">{r.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Frequency" required>
            <Select value={form.frequency} onValueChange={(v) => setForm({ ...form, frequency: v as ScheduledReport['frequency'] })}>
              <SelectTrigger className="h-12 text-base"><SelectValue /></SelectTrigger>
              <SelectContent>
                {['daily', 'weekly', 'monthly', 'quarterly'].map((f) => (
                  <SelectItem key={f} value={f} className="capitalize text-base">{f}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Format" required>
            <Select value={form.format} onValueChange={(v) => setForm({ ...form, format: v as ScheduledReport['format'] })}>
              <SelectTrigger className="h-12 text-base"><SelectValue /></SelectTrigger>
              <SelectContent>
                {['excel', 'pdf', 'csv'].map((f) => (
                  <SelectItem key={f} value={f} className="uppercase text-base">{f}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Recipients" required>
            <Input
              value={recipientsText}
              onChange={(e) => setRecipientsText(e.target.value)}
              placeholder="email@company.com, ops@company.com"
              className="h-12 text-base"
            />
          </Field>
        </div>
        <div className="border-t pt-4">
          <Button className="h-11 w-full text-base" onClick={submit}>
            {schedule ? 'Update Schedule' : 'Create Schedule'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <div>
      <Label className="text-base font-medium">
        {label}{required && <span className="text-destructive"> *</span>}
      </Label>
      <div className="mt-2">{children}</div>
    </div>
  )
}
