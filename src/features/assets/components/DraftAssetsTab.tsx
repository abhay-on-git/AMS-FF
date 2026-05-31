import { useState, useMemo } from 'react'
import { Download, Upload, RefreshCw, MoreHorizontal, ClipboardCheck, Trash2, Columns3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu'
import { DataTable, ConfirmDialog } from '@/components/shared'
import { useDrafts } from '../hooks/useAssets'
import { useDeleteDraft } from '../hooks/useAssetMutations'
import { defaultDraftColumns } from '../constants/draftColumns'
import type { AssetColumnConfig } from '../types'
import type { DraftAsset } from '../types/draftTypes'

interface DraftAssetsTabProps {
  onRegister: (draft: DraftAsset) => void
}

const LAST_SYNCED = 'Apr 14, 2026, 03:00 PM'

export function DraftAssetsTab({ onRegister }: DraftAssetsTabProps) {
  const { data: drafts = [], isLoading } = useDrafts()
  const [columns, setColumns] = useState<AssetColumnConfig[]>(defaultDraftColumns)
  const [search, setSearch] = useState('')
  const [classFilter, setClassFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [deleteTarget, setDeleteTarget] = useState<DraftAsset | null>(null)
  const deleteMutation = useDeleteDraft(() => setDeleteTarget(null))

  const toggleColumn = (key: string) =>
    setColumns((prev) => prev.map((c) => (c.key === key ? { ...c, visible: !c.visible } : c)))

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return drafts.filter((d) => {
      const matchSearch = !q ||
        d.draftId.toLowerCase().includes(q) ||
        d.poNumber.toLowerCase().includes(q) ||
        d.grnNumber.toLowerCase().includes(q) ||
        d.itemDescription.toLowerCase().includes(q)
      const matchClass = classFilter === 'all' || d.classification === classFilter
      const matchStatus = statusFilter === 'all' || d.assignmentStatus === statusFilter
      return matchSearch && matchClass && matchStatus
    })
  }, [drafts, search, classFilter, statusFilter])

  const visibleColumns = columns.filter((c) => c.visible)

  const tableColumns = visibleColumns.map((col) => ({
    key: col.key,
    header: col.label,
    render: (draft: DraftAsset) => {
      const val = draft[col.key as keyof DraftAsset]

      if (col.key === 'draftId')
        return <span className="font-medium text-15 text-brand-navy dark:text-brand-teal">{String(val)}</span>

      if (col.key === 'classification')
        return (
          <Badge variant="outline" className={
            val === 'Capital'
              ? 'border-blue-300 text-blue-700 dark:text-blue-300'
              : 'border-amber-300 text-amber-700 dark:text-amber-300'
          }>{String(val)}</Badge>
        )

      if (col.key === 'assignmentStatus')
        return (
          <Badge variant="outline" className={
            val === 'Assigned'
              ? 'border-green-300 text-green-700 dark:text-green-300'
              : 'border-muted-foreground/40 text-muted-foreground'
          }>{String(val)}</Badge>
        )

      if (col.key === 'unitPrice' || col.key === 'totalCost')
        return (
          <span className="text-15">
            ${typeof val === 'number' ? val.toLocaleString('en-US', { minimumFractionDigits: 2 }) : val}
          </span>
        )

      if (val === undefined || val === null || val === '')
        return <span className="text-muted-foreground/50">—</span>

      return <span className="text-15">{String(val)}</span>
    },
  }))

  if (isLoading) return <div className="p-6 text-muted-foreground">Loading drafts...</div>

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-15 text-muted-foreground">
          <RefreshCw className="w-4 h-4" />
          Last synced: {LAST_SYNCED}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-15 gap-2 h-10">
            <Download className="w-4 h-4" />
            Download Template
          </Button>
          <Button variant="outline" size="sm" className="text-15 gap-2 h-10">
            <Upload className="w-4 h-4" />
            Bulk Upload
          </Button>
          <Button size="sm" className="text-15 gap-2 h-10 bg-brand-navy hover:bg-brand-navy-mid text-white">
            <RefreshCw className="w-4 h-4" />
            Sync from SAP
          </Button>
        </div>
      </div>

      <Card>
        {/* Filter bar */}
        <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Input
              placeholder="Search Draft ID, PO, GRN, description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 text-15 pl-3 placeholder:text-muted-foreground/60"
            />
          </div>

          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="h-10 w-[145px] text-15">
              <SelectValue placeholder="All Classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-15">All Classes</SelectItem>
              <SelectItem value="Capital" className="text-15">Capital</SelectItem>
              <SelectItem value="Attractive" className="text-15">Attractive</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-10 w-[135px] text-15">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-15">All Status</SelectItem>
              <SelectItem value="Unassigned" className="text-15">Unassigned</SelectItem>
              <SelectItem value="Assigned" className="text-15">Assigned</SelectItem>
            </SelectContent>
          </Select>

          {/* Column toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-10 text-15 gap-2">
                <Columns3 className="w-4 h-4" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {columns.map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.key}
                  checked={col.visible}
                  onCheckedChange={() => toggleColumn(col.key)}
                  className="text-15"
                >
                  {col.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Export */}
          <Button variant="outline" size="sm" className="h-10 w-10 p-0">
            <Download className="w-4 h-4" />
          </Button>
        </div>

        <CardContent className="p-0">
          <DataTable
            data={filtered}
            columns={tableColumns}
            keyExtractor={(d) => d.id}
            emptyMessage="No draft assets pending registration"
            actionsColumn={(draft) => (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onRegister(draft)}>
                    <ClipboardCheck className="w-4 h-4 mr-2" />
                    Complete Registration
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => setDeleteTarget(draft)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Draft
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          />
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
        title="Delete Draft Asset?"
        description={
          deleteTarget
            ? `This will permanently delete draft "${deleteTarget.draftId}" (${deleteTarget.itemDescription}). This action cannot be undone.`
            : undefined
        }
        confirmLabel="Delete Draft"
        variant="destructive"
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.draftId)}
      />
    </div>
  )
}
