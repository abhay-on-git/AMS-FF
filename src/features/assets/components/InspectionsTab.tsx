import { useState, useMemo } from 'react'
import {
  Plus, MoreHorizontal, Search, Columns3, Download,
  ClipboardCheck, Clock, CheckCheck, XCircle, FileText,
  Play, Star, AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { useInspections } from '../hooks/useAssets'
import { TablePagination } from '@/components/shared'
import { useTablePagination } from '@/hooks/useTablePagination'
import { useAppSelector } from '@/store/hooks'
import { defaultInspectionColumns } from '../constants/inspectionColumns'
import {
  getInspectionStatusColor, getInspectionStatusLabel,
  getInspectionTypeColor, getInspectionTypeLabel,
  getResultColor, getResultLabel,
} from '../types/inspectionTypes'
import type { AssetColumnConfig } from '../types'
import type { InspectionRequest, InspectionStatus } from '../types/inspectionTypes'

type SubView = 'all' | 'mine' | 'pending-review' | 'scheduled'

const STAT_CARDS = [
  { key: 'total',         label: 'Total',          color: 'bg-[#121321]', Icon: ClipboardCheck },
  { key: 'scheduled',     label: 'Scheduled',      color: 'bg-blue-600',  Icon: Clock },
  { key: 'inProgress',    label: 'In Progress',    color: 'bg-amber-600', Icon: Play },
  { key: 'pendingReview', label: 'Pending Review', color: 'bg-purple-600',Icon: Star },
  { key: 'completed',     label: 'Completed',      color: 'bg-green-600', Icon: CheckCheck },
  { key: 'failed',        label: 'Failed',         color: 'bg-red-600',   Icon: XCircle },
  { key: 'drafts',        label: 'Drafts',         color: 'bg-gray-500',  Icon: FileText },
] as const

interface InspectionsTabProps {
  onViewDetail:    (inspection: InspectionRequest) => void
  onSchedule:      () => void
  onStart:         (id: string) => void
  onComplete:      (id: string) => void
  onApproveReview: (id: string) => void
}

export function InspectionsTab({ onViewDetail, onSchedule, onStart, onComplete, onApproveReview }: InspectionsTabProps) {
  const currentUser = useAppSelector((state) => state.auth.user?.name ?? '')
  const { data: inspections = [], isLoading } = useInspections()

  const [subView,      setSubView]      = useState<SubView>('all')
  const [search,       setSearch]       = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter,   setTypeFilter]   = useState('all')
  const [columns,      setColumns]      = useState<AssetColumnConfig[]>(defaultInspectionColumns)

  const toggleColumn = (key: string) =>
    setColumns((prev) => prev.map((c) => c.key === key ? { ...c, visible: !c.visible } : c))

  const isLocked         = subView === 'pending-review' || subView === 'scheduled'
  const effectiveStatus  = subView === 'pending-review' ? 'pending-review'
                         : subView === 'scheduled'      ? 'scheduled'
                         : statusFilter
  const effectiveType    = isLocked ? 'all' : typeFilter

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return inspections.filter((ins) => {
      const matchSearch = !q ||
        ins.inspectionId.toLowerCase().includes(q) ||
        ins.title.toLowerCase().includes(q) ||
        ins.inspector.toLowerCase().includes(q) ||
        ins.location.toLowerCase().includes(q) ||
        ins.fieldOffice.toLowerCase().includes(q)
      const matchStatus = effectiveStatus === 'all' || ins.status === effectiveStatus
      const matchType   = effectiveType   === 'all' || ins.inspectionType === effectiveType
      const matchView   = subView === 'mine' ? ins.inspector === currentUser : true
      return matchSearch && matchStatus && matchType && matchView
    })
  }, [inspections, search, effectiveStatus, effectiveType, subView, currentUser])

  const { page, rowsPerPage, setPage, setRowsPerPage, pageData } = useTablePagination(
    filtered,
    [search, effectiveStatus, effectiveType, subView],
  )

  const stats = useMemo(() => ({
    total:         inspections.length,
    scheduled:     inspections.filter((i) => i.status === 'scheduled').length,
    inProgress:    inspections.filter((i) => i.status === 'in-progress').length,
    pendingReview: inspections.filter((i) => i.status === 'pending-review').length,
    completed:     inspections.filter((i) => i.status === 'completed').length,
    failed:        inspections.filter((i) => i.status === 'failed').length,
    drafts:        inspections.filter((i) => i.status === 'draft').length,
  }), [inspections])

  if (isLoading) return <div className="p-6 text-muted-foreground">Loading inspections...</div>

  return (
    <div className="space-y-5 min-w-0">
      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {STAT_CARDS.map(({ key, label, color, Icon }) => (
          <div key={key} className="flex items-center gap-3 p-3 rounded-[4px] border bg-background">
            <div className={`w-9 h-9 rounded-[4px] ${color} flex items-center justify-center text-white shrink-0`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xl font-bold">{stats[key as keyof typeof stats]}</p>
              <p className="text-[13px] text-muted-foreground truncate">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Sub-view tabs + Schedule button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-[4px]">
          {([
            { value: 'all',            label: 'All Inspections' },
            { value: 'mine',           label: 'My Inspections' },
            { value: 'pending-review', label: 'Pending Review', badge: stats.pendingReview },
            { value: 'scheduled',      label: 'Scheduled',      badge: stats.scheduled },
          ] as { value: SubView; label: string; badge?: number }[]).map((tab) => (
            <button key={tab.value} onClick={() => setSubView(tab.value)}
              className={`px-3 py-1.5 rounded-[4px] text-[15px] transition-colors flex items-center gap-1.5 ${
                subView === tab.value ? 'bg-[#121321] text-white shadow-sm' : 'text-foreground hover:bg-muted'
              }`}>
              {tab.label}
              {tab.badge != null && tab.badge > 0 && (
                <span className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full text-[11px] font-medium ${
                  subView === tab.value ? 'bg-white/20 text-white' : 'bg-purple-500 text-white'
                }`}>{tab.badge}</span>
              )}
            </button>
          ))}
        </div>
        <Button onClick={onSchedule}
          className="gap-1.5 bg-brand-navy hover:bg-brand-navy-mid text-white text-[15px]">
          <Plus className="w-4 h-4" />
          Schedule Inspection
        </Button>
      </div>

      {/* Filter + Table card */}
      <Card>
        <div className="px-4 pt-4 pb-3 border-b">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search ID, title, inspector, location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-10 text-[15px] placeholder:text-muted-foreground/60"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select value={effectiveStatus} onValueChange={setStatusFilter} disabled={isLocked}>
                <SelectTrigger className={`w-[165px] h-10 text-[15px] ${isLocked ? 'opacity-60 cursor-not-allowed' : ''}`}>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-[15px]">All Status</SelectItem>
                  <SelectItem value="draft" className="text-[15px]">Draft</SelectItem>
                  <SelectItem value="scheduled" className="text-[15px]">Scheduled</SelectItem>
                  <SelectItem value="in-progress" className="text-[15px]">In Progress</SelectItem>
                  <SelectItem value="pending-review" className="text-[15px]">Pending Review</SelectItem>
                  <SelectItem value="completed" className="text-[15px]">Completed</SelectItem>
                  <SelectItem value="failed" className="text-[15px]">Failed</SelectItem>
                  <SelectItem value="cancelled" className="text-[15px]">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={effectiveType} onValueChange={setTypeFilter} disabled={isLocked}>
                <SelectTrigger className={`w-[155px] h-10 text-[15px] ${isLocked ? 'opacity-60 cursor-not-allowed' : ''}`}>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-[15px]">All Types</SelectItem>
                  <SelectItem value="scheduled" className="text-[15px]">Scheduled</SelectItem>
                  <SelectItem value="spot-check" className="text-[15px]">Spot Check</SelectItem>
                  <SelectItem value="pre-transfer" className="text-[15px]">Pre-Transfer</SelectItem>
                  <SelectItem value="post-incident" className="text-[15px]">Post-Incident</SelectItem>
                  <SelectItem value="regulatory" className="text-[15px]">Regulatory</SelectItem>
                </SelectContent>
              </Select>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-10 text-[15px] gap-1.5 px-3">
                    <Columns3 className="w-4 h-4" />Columns
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {columns.map((col) => (
                    <DropdownMenuCheckboxItem key={col.key} checked={col.visible}
                      onCheckedChange={() => toggleColumn(col.key)} className="text-[15px]">
                      {col.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" size="sm" className="h-10 w-10 p-0">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <CardContent className="p-0">
          {filtered.length > 0 ? (
            <div className="rounded-md border mx-4 mb-0 overflow-hidden mt-3">
              <div className="overflow-auto max-h-[calc(100vh-520px)] scrollbar-hide font-['Manrope']">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[15px]">Inspection ID</TableHead>
                      <TableHead className="text-[15px]">Type</TableHead>
                      <TableHead className="text-[15px]">Title</TableHead>
                      <TableHead className="text-[15px]">Status</TableHead>
                      <TableHead className="text-[15px]">Result</TableHead>
                      <TableHead className="text-[15px]">Inspector</TableHead>
                      <TableHead className="text-[15px]">Scheduled</TableHead>
                      <TableHead className="text-[15px]">Checklist</TableHead>
                      <TableHead className="w-20 text-[15px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pageData.map((ins) => {
                      const checkedCount = ins.checklist.filter((c) => c.checked).length
                      const totalCheck   = ins.checklist.length
                      return (
                        <TableRow key={ins.id} className="cursor-pointer hover:bg-muted/30" onClick={() => onViewDetail(ins)}>
                          <TableCell className="font-medium text-[15px] text-brand-navy dark:text-brand-teal">
                            {ins.inspectionId}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`text-[12px] ${getInspectionTypeColor(ins.inspectionType)}`}>
                              {getInspectionTypeLabel(ins.inspectionType)}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-[200px]">
                            <p className="text-[15px] truncate">{ins.title}</p>
                            <p className="text-[13px] text-muted-foreground">{ins.fieldOffice} · {ins.location}</p>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`text-[12px] whitespace-nowrap ${getInspectionStatusColor(ins.status as InspectionStatus)}`}>
                              {getInspectionStatusLabel(ins.status as InspectionStatus)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`text-[12px] ${getResultColor(ins.result)}`}>
                              {getResultLabel(ins.result)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-[15px]">{ins.inspector}</TableCell>
                          <TableCell className="text-[15px] text-muted-foreground whitespace-nowrap">
                            {new Date(ins.scheduledDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {totalCheck > 0 ? (
                              <div className="flex items-center gap-2">
                                <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${checkedCount === totalCheck ? 'bg-green-500' : 'bg-brand-teal'}`}
                                    style={{ width: `${(checkedCount / totalCheck) * 100}%` }}
                                  />
                                </div>
                                <span className="text-[13px] text-muted-foreground whitespace-nowrap">{checkedCount}/{totalCheck}</span>
                              </div>
                            ) : (
                              <span className="text-[15px] text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0"
                                  onClick={(e) => e.stopPropagation()}>
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                                <DropdownMenuItem onClick={() => onViewDetail(ins)}>View Detail</DropdownMenuItem>
                                {ins.status === 'scheduled' && (
                                  <DropdownMenuItem onClick={() => onStart(ins.id)}>
                                    <Play className="w-4 h-4 mr-2" />Start Inspection
                                  </DropdownMenuItem>
                                )}
                                {ins.status === 'in-progress' && (
                                  <DropdownMenuItem onClick={() => onComplete(ins.id)}>
                                    <CheckCheck className="w-4 h-4 mr-2" />Complete Inspection
                                  </DropdownMenuItem>
                                )}
                                {ins.status === 'pending-review' && (
                                  <DropdownMenuItem onClick={() => onApproveReview(ins.id)}>
                                    <Star className="w-4 h-4 mr-2" />Approve Review
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
              <TablePagination
                totalItems={filtered.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={setPage}
                onRowsPerPageChange={setRowsPerPage}
                totalUnfilteredItems={inspections.length}
                itemLabel="inspections"
              />
            </div>
          ) : (
            <div className="text-center py-12 px-6">
              <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <h3 className="text-lg font-medium mb-1">No inspections found</h3>
              <p className="text-[15px] text-muted-foreground mb-4">
                {search || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Schedule an inspection to get started'}
              </p>
              {search || statusFilter !== 'all' ? (
                <Button variant="outline" size="sm"
                  onClick={() => { setSearch(''); setStatusFilter('all'); setTypeFilter('all') }}>
                  Clear Filters
                </Button>
              ) : (
                <Button size="sm" onClick={onSchedule} className="bg-brand-navy hover:bg-brand-navy-mid text-white">
                  <Plus className="w-4 h-4 mr-1.5" />Schedule Inspection
                </Button>
              )}
            </div>
          )}
          <div className="h-4" />
        </CardContent>
      </Card>
    </div>
  )
}
