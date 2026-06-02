import { useState } from 'react'
import { Filter, ChevronDown, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { AdvancedFilterState } from '../types'
import { categoryOptions } from '../constants/assetFilters'

interface AdvancedFiltersProps {
  filters: AdvancedFilterState
  onFiltersChange: (filters: AdvancedFilterState) => void
  onClearAll: () => void
}

export function AdvancedFilters({ filters, onFiltersChange, onClearAll }: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  const update = (key: keyof AdvancedFilterState, value: string) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const activeFilterCount = Object.entries(filters).filter(([_, v]) => v !== '' && v !== 'all').length

  const activeChips = Object.entries(filters)
    .filter(([_, v]) => v !== '' && v !== 'all')
    .map(([key, value]) => ({ key: key as keyof AdvancedFilterState, label: formatFilterLabel(key), value }))

  const removeChip = (key: keyof AdvancedFilterState) => {
    const isSelectFilter = ['fieldOffice', 'location', 'assetType', 'category', 'lifecycleStatus', 'condition', 'supplier', 'warrantyStatus', 'rfidTagStatus', 'inspectionStatus', 'usageStatus'].includes(key)
    update(key, isSelectFilter ? 'all' : '')
  }

  return (
    <div className="space-y-2">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between">
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 text-15">
              <Filter className="w-4 h-4" />
              Advanced Filters
              {activeFilterCount > 0 && (
                <Badge className="bg-brand-navy text-white ml-1 px-1.5 py-0 text-xs">
                  {activeFilterCount}
                </Badge>
              )}
              <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" onClick={onClearAll} className="text-15 gap-1">
              <X className="w-3.5 h-3.5" />
              Clear All
            </Button>
          )}
        </div>

        <CollapsibleContent>
          <div className="border rounded-[4px] p-4 mt-2 bg-muted/30 space-y-4">
            {/* Row 1 */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <FilterField label="Field Office">
                <FilterSelect value={filters.fieldOffice} onChange={(v) => update('fieldOffice', v)}
                  options={[{ value: 'all', label: 'All Offices' }, { value: 'Headquarters', label: 'Headquarters' }, { value: 'Regional Office East', label: 'Regional Office East' }, { value: 'Regional Office West', label: 'Regional Office West' }]} />
              </FilterField>
              <FilterField label="Location">
                <FilterSelect value={filters.location} onChange={(v) => update('location', v)}
                  options={[{ value: 'all', label: 'All Locations' }, { value: 'Office Floor 1', label: 'Office Floor 1' }, { value: 'Office Floor 2', label: 'Office Floor 2' }, { value: 'Office A1-02', label: 'Office A1-02' }, { value: 'Office A1-03', label: 'Office A1-03' }, { value: 'Office A1-05', label: 'Office A1-05' }, { value: 'Server Room B2', label: 'Server Room B2' }, { value: 'Warehouse B1', label: 'Warehouse B1' }]} />
              </FilterField>
              <FilterField label="Category">
                <FilterSelect value={filters.category} onChange={(v) => update('category', v)}
                  options={categoryOptions} />
              </FilterField>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
              <FilterField label="Lifecycle Status">
                <FilterSelect value={filters.lifecycleStatus} onChange={(v) => update('lifecycleStatus', v)}
                  options={[{ value: 'all', label: 'All Status' }, { value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }, { value: 'maintenance', label: 'Maintenance' }, { value: 'missing', label: 'Missing' }, { value: 'disposed', label: 'Disposed' }, { value: 'in-transit', label: 'In Transit' }]} />
              </FilterField>
              <FilterField label="Condition">
                <FilterSelect value={filters.condition} onChange={(v) => update('condition', v)}
                  options={[{ value: 'all', label: 'All Conditions' }, { value: 'new', label: 'New' }, { value: 'good', label: 'Good' }, { value: 'fair', label: 'Fair' }, { value: 'poor', label: 'Poor' }, { value: 'damaged', label: 'Damaged' }]} />
              </FilterField>
            </div>

            {/* Row 3 - Date and Value */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <FilterField label="Acquisition Date">
                <Input type="date" value={filters.acquisitionDateFrom}
                  onChange={(e) => update('acquisitionDateFrom', e.target.value)} className="h-8 text-15" />
              </FilterField>
              <FilterField label="Value Min ($)">
                <Input type="number" value={filters.valueMin}
                  onChange={(e) => update('valueMin', e.target.value)} placeholder="0" className="h-8 text-15" />
              </FilterField>
              <FilterField label="Value Max ($)">
                <Input type="number" value={filters.valueMax}
                  onChange={(e) => update('valueMax', e.target.value)} placeholder="999999" className="h-8 text-15" />
              </FilterField>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Active filter chips when collapsed */}
      {activeChips.length > 0 && !isOpen && (
        <div className="flex flex-wrap gap-1.5">
          {activeChips.map((chip) => (
            <Badge key={chip.key} variant="secondary" className="gap-1 pl-2 pr-1 py-0.5 text-15">
              <span className="text-muted-foreground">{chip.label}:</span> {chip.value}
              <button onClick={() => removeChip(chip.key)} className="ml-0.5 rounded-full p-0.5 hover:bg-muted">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="text-15 text-muted-foreground">{label}</Label>
      {children}
    </div>
  )
}

function FilterSelect({ value, onChange, options }: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-8 text-15">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-brand-navy-mid">
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value} className="text-15">
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function formatFilterLabel(key: string): string {
  const labels: Record<string, string> = {
    fieldOffice: 'Office', location: 'Location', custodian: 'Custodian',
    assetType: 'Type', category: 'Category', lifecycleStatus: 'Status',
    poNumber: 'PO', grnNumber: 'GRN', acquisitionDateFrom: 'Acq. From',
    acquisitionDateTo: 'Acq. To', lastUpdatedFrom: 'Updated From',
    lastUpdatedTo: 'Updated To', valueMin: 'Min Value', valueMax: 'Max Value',
    condition: 'Condition', supplier: 'Supplier', warrantyStatus: 'Warranty',
    rfidTagStatus: 'RFID Tag', inspectionStatus: 'Inspection', usageStatus: 'Usage',
  }
  return labels[key] || key
}
