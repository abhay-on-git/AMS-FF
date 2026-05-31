import { useState, type ReactNode } from 'react'
import { ArrowDown, ArrowUp, Building2, Columns3, Save, SortAsc } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { AVAILABLE_FIELDS, FIELD_OFFICES } from '../constants/reportingData'
import { CustomReportFieldPicker } from './custom/CustomReportFieldPicker'
import { CustomReportFilters } from './custom/CustomReportFilters'
import { CustomSavedQueriesPanel } from './custom/CustomSavedQueriesPanel'
import { useReportAccess } from '../hooks/useReportAccess'
import { useDeleteSavedQuery, useSaveQuery } from '../hooks/useReportsMutations'
import { useSavedQueries } from '../hooks/useReportsQueries'
import { runReport } from '../services/reportingService'
import type { CustomFilter, ReportRow, SavedQuery } from '../types'
import { getSortedResults } from '../utils/reportResults'
import { ReportPreviewDialog, ReportShareDialog } from './ReportDialogs'
import { ReportsBackButton } from './ReportsBackNav'

interface CustomReportViewProps {
  onBack: () => void
}

export function CustomReportView({ onBack }: CustomReportViewProps) {
  const { isManagerOrAbove } = useReportAccess()
  const { data: savedQueries = [] } = useSavedQueries()
  const saveQuery = useSaveQuery(() => setSaveOpen(false))
  const deleteQuery = useDeleteSavedQuery()

  const [fieldOffice, setFieldOffice] = useState('All Offices')
  const [filters, setFilters] = useState<CustomFilter[]>([])
  const [selectedFields, setSelectedFields] = useState(['assetId', 'name', 'category', 'location', 'status'])
  const [groupBy, setGroupBy] = useState('none')
  const [sortBy, setSortBy] = useState('assetId')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [rows, setRows] = useState<ReportRow[]>([])
  const [previewOpen, setPreviewOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [saveOpen, setSaveOpen] = useState(false)
  const [saveName, setSaveName] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const run = async () => {
    if (filters.length === 0) {
      toast.error('Please add at least one filter')
      return
    }
    toast.success('Running custom report...')
    const data = await runReport('custom', fieldOffice, selectedFields)
    setRows(getSortedResults(data, sortBy, sortOrder))
    setPreviewOpen(true)
  }

  const loadQuery = (query: SavedQuery) => {
    setFilters(query.filters)
    setSelectedFields(query.selectedFields)
    if (query.groupBy) setGroupBy(query.groupBy)
    if (query.sortBy) setSortBy(query.sortBy)
    if (query.sortOrder) setSortOrder(query.sortOrder)
    toast.success(`Loaded query: ${query.name}`)
  }

  const handleSort = (field: string) => {
    const next = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc'
    setSortBy(field)
    setSortOrder(next)
    setRows(getSortedResults(rows, field, next))
  }

  const handleSave = () => {
    if (!saveName.trim()) {
      toast.error('Please enter a name for this query')
      return
    }
    saveQuery.mutate({
      name: saveName,
      description: `Custom query with ${filters.length} filter(s)`,
      filters,
      selectedFields,
      groupBy,
      sortBy,
      sortOrder,
      createdBy: 'admin@company.com',
    })
    setSaveName('')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <ReportsBackButton onBack={onBack} />
        <div className="flex shrink-0 flex-nowrap items-center gap-3">
          <Select value={fieldOffice} onValueChange={setFieldOffice}>
            <SelectTrigger className="h-11 w-[220px] text-base"><SelectValue /></SelectTrigger>
            <SelectContent>
              {FIELD_OFFICES.map((o) => (
                <SelectItem key={o} value={o} className="text-base">{o}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" className="h-11 text-base" onClick={() => setSaveOpen(true)}>Save Query</Button>
          <Button className="h-11 bg-brand-navy text-base text-white hover:bg-brand-navy-mid" onClick={run}>Run Report</Button>
        </div>
      </div>

      {fieldOffice !== 'All Offices' && (
        <Badge className="gap-1.5 bg-brand-navy px-3 py-1.5 text-sm text-white">
          <Building2 className="h-3.5 w-3.5" />
          Filtering data for: {fieldOffice}
        </Badge>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <CustomReportFilters filters={filters} onChange={setFilters} />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <GroupSortCard icon={Columns3} title="Group By" value={groupBy} onChange={setGroupBy} options={[
              { v: 'none', l: 'No Grouping' }, { v: 'category', l: 'Category' }, { v: 'location', l: 'Location' },
              { v: 'fieldOffice', l: 'Field Office' }, { v: 'custodian', l: 'Custodian' }, { v: 'status', l: 'Status' },
            ]} />
            <GroupSortCard icon={SortAsc} title="Sort By" value={sortBy} onChange={setSortBy} options={AVAILABLE_FIELDS.map((f) => ({ v: f.id, l: f.label }))}
              extra={
                <Button variant="outline" size="icon" className="h-12 w-12 shrink-0" onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                  {sortOrder === 'asc' ? <ArrowUp className="h-5 w-5" /> : <ArrowDown className="h-5 w-5" />}
                </Button>
              }
            />
          </div>
          <CustomReportFieldPicker selectedFields={selectedFields} onChange={setSelectedFields} isManagerOrAbove={isManagerOrAbove} />
        </div>
        <CustomSavedQueriesPanel queries={savedQueries} onLoad={loadQuery} onDelete={setDeleteId} />
      </div>

      <ReportPreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        title="Custom Report Results"
        description={`${rows.length} records found — Sorted by ${AVAILABLE_FIELDS.find((f) => f.id === sortBy)?.label || sortBy} (${sortOrder})`}
        rowCount={rows.length}
        selectedFields={selectedFields}
        groupBy={groupBy}
        sortBy={sortBy}
        sortOrder={sortOrder}
        rows={rows}
        onSort={handleSort}
        onShare={() => setShareOpen(true)}
      />
      <ReportShareDialog open={shareOpen} onOpenChange={setShareOpen} />

      <Sheet open={saveOpen} onOpenChange={setSaveOpen}>
        <SheetContent side="right" className="sm:max-w-xl">
          <SheetHeader>
            <SheetTitle className="text-xl">Save Query Template</SheetTitle>
            <SheetDescription className="text-base">Save the current filter, grouping, and sort configuration.</SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div>
              <Label className="text-base font-medium">Query Name</Label>
              <Input value={saveName} onChange={(e) => setSaveName(e.target.value)} className="mt-2 h-12 text-base" placeholder="e.g. High-Value IT Assets" />
            </div>
            <Button className="h-11 w-full text-base" onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Query
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Saved Query"
        description="Are you sure you want to delete this saved query?"
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => {
          if (deleteId) deleteQuery.mutate(deleteId)
          setDeleteId(null)
        }}
      />
    </div>
  )
}

function GroupSortCard({
  icon: Icon,
  title,
  value,
  onChange,
  options,
  extra,
}: {
  icon: typeof Columns3
  title: string
  value: string
  onChange: (v: string) => void
  options: { v: string; l: string }[]
  extra?: ReactNode
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="h-5 w-5 text-muted-foreground" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="h-12 flex-1 text-base"><SelectValue /></SelectTrigger>
            <SelectContent>
              {options.map((o) => (
                <SelectItem key={o.v} value={o.v} className="text-base">{o.l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {extra}
        </div>
      </CardContent>
    </Card>
  )
}
