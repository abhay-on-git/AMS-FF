import { useState } from 'react'
import { Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { CustomFilter } from '../../types'

const FILTER_FIELDS = [
  'category', 'status', 'location', 'fieldOffice', 'custodian', 'value', 'poNumber', 'condition', 'supplier',
]

const OPERATORS = [
  { v: 'equals', l: 'Equals' },
  { v: 'not_equals', l: 'Not Equals' },
  { v: 'contains', l: 'Contains' },
  { v: 'greater_than', l: 'Greater Than' },
  { v: 'less_than', l: 'Less Than' },
  { v: 'between', l: 'Between' },
]

interface CustomReportFiltersProps {
  filters: CustomFilter[]
  onChange: (filters: CustomFilter[]) => void
}

export function CustomReportFilters({ filters, onChange }: CustomReportFiltersProps) {
  const add = () => onChange([...filters, { field: 'category', operator: 'equals', value: '' }])
  const update = (index: number, patch: Partial<CustomFilter>) => {
    const next = [...filters]
    next[index] = { ...next[index], ...patch }
    onChange(next)
  }
  const remove = (index: number) => onChange(filters.filter((_, i) => i !== index))

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5 text-muted-foreground" />
            Filter Criteria
          </CardTitle>
          <Button size="default" className="h-10 text-base" onClick={add}>Add Filter</Button>
        </div>
      </CardHeader>
      <CardContent>
        {filters.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">No filters added yet. Click &quot;Add Filter&quot; to start.</p>
        ) : (
          <div className="space-y-4">
            {filters.map((filter, index) => (
              <div key={index} className="flex items-end gap-3">
                <div className="grid flex-1 grid-cols-3 gap-3">
                  <FilterSelect label="Field" value={filter.field} options={FILTER_FIELDS} onChange={(v) => update(index, { field: v })} />
                  <FilterSelect label="Operator" value={filter.operator} options={OPERATORS.map((o) => o.v)} labels={OPERATORS.map((o) => o.l)} onChange={(v) => update(index, { operator: v })} />
                  <div>
                    <Label className="mb-1.5 block text-base font-medium">Value</Label>
                    <Input value={filter.value} onChange={(e) => update(index, { value: e.target.value })} className="h-11 text-base" placeholder="Enter value" />
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-11 w-11 text-destructive" onClick={() => remove(index)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function FilterSelect({
  label,
  value,
  options,
  labels,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  labels?: string[]
  onChange: (v: string) => void
}) {
  return (
    <div>
      <Label className="mb-1.5 block text-base font-medium">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-11 text-base"><SelectValue /></SelectTrigger>
        <SelectContent>
          {options.map((opt, i) => (
            <SelectItem key={opt} value={opt} className="text-base capitalize">
              {labels?.[i] ?? opt.replace(/([A-Z])/g, ' $1')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
