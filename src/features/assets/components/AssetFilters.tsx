import { Search, Download, Columns3, Check } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { toast } from 'sonner'
import { typeOptions, conditionOptions, locationOptions, classificationOptions } from '../constants/assetFilters'
import type { AssetColumnConfig } from '../types'

interface AssetFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  typeFilter: string
  onTypeChange: (value: string) => void
  conditionFilter: string
  onConditionChange: (value: string) => void
  locationFilter: string
  onLocationChange: (value: string) => void
  classificationFilter: string
  onClassificationChange: (value: string) => void
  columns: AssetColumnConfig[]
  onToggleColumn: (key: string) => void
}

export function AssetFilters({
  search,
  onSearchChange,
  typeFilter,
  onTypeChange,
  conditionFilter,
  onConditionChange,
  locationFilter,
  onLocationChange,
  classificationFilter,
  onClassificationChange,
  columns,
  onToggleColumn,
}: AssetFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search Asset ID, EPC, Barcode, Serial, PO, Custodian, Location, Name..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 text-15 placeholder:text-muted-foreground/60"
        />
      </div>
      <div className="flex gap-2 items-center">
        <FilterSelect value={typeFilter} onChange={onTypeChange} options={typeOptions} width="w-40" />
        <FilterSelect value={conditionFilter} onChange={onConditionChange} options={conditionOptions} width="w-40" />
        <FilterSelect value={locationFilter} onChange={onLocationChange} options={locationOptions} width="w-40" />
        <FilterSelect value={classificationFilter} onChange={onClassificationChange} options={classificationOptions} width="w-36" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5 h-[2.6rem] text-15">
              <Columns3 className="w-4 h-4" />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-2">
            {columns.map((col) => (
              <label
                key={col.key}
                className="flex items-center gap-2 px-2 py-1.5 rounded-[4px] cursor-pointer text-15 hover:bg-muted/50"
                onClick={() => onToggleColumn(col.key)}
              >
                <span className={`flex items-center justify-center w-[18px] h-[18px] rounded-[5px] transition-all ${
                  col.visible
                    ? 'bg-sidebar border border-sidebar'
                    : 'bg-hover-light border-2 border-divider'
                }`}>
                  {col.visible && <Check className="w-3 h-3 text-white" />}
                </span>
                {col.label}
              </label>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info('Downloading assets as Excel...')}
              className="h-10 w-10"
            >
              <Download className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Download as Excel</p></TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}

function FilterSelect({ value, onChange, options, width }: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  width: string
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={`${width} text-15 pr-2 [&>svg]:right-2`}>
        <SelectValue placeholder={options[0]?.label} />
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
