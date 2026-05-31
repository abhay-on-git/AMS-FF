import { useState, useMemo } from 'react'
import {
  Plus, MoreHorizontal, Search, Columns3, Download,
  Trash2, Clock, CheckCheck, Play, AlertCircle,
  DollarSign, ShieldAlert, XCircle, FileText,
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
import { useDisposals } from '../hooks/useAssets'
import { TablePagination } from '@/components/shared'
import { useTablePagination } from '@/hooks/useTablePagination'
import { useAppSelector } from '@/store/hooks'
import { defaultDisposalColumns } from '../constants/disposalColumns'
import {
  getDisposalStatusColor, getDisposalStatusLabel,
  getDisposalMethodColor, getDisposalMethodLabel,
} from '../types/disposalTypes'
import type { AssetColumnConfig } from '../types'
import type { DisposalRequest, DisposalStatus } from '../types/disposalTypes'

type SubView = 'all' | 'mine' | 'pending-approval' | 'active'

const STAT_CARDS = [
  { key: 'total',            label: 'Total Requests',   color: 'bg-[#121321]',   Icon: Trash2      },
  { key: 'pending-review',   label: 'Pending Review',   color: 'bg-cyan-600',    Icon: FileText    },
  { key: 'pending-approval', label: 'Pending Approval', color: 'bg-amber-600',   Icon: Clock       },
  { key: 'approved',         label: 'Approved',         color: 'bg-blue-600',    Icon: CheckCheck  },
  { key: 'in-progress',      label: 'In Progress',      color: 'bg-indigo-600',  Icon: Play        },
  { key: 'completed',        label: 'Completed',        color: 'bg-green-600',   Icon: DollarSign  },
  { key: 'rejected',         label: 'Rejected',         color: 'bg-red-600',     Icon: XCircle     },
]

interface DisposalsTabProps {
  onViewDetail:    (disposal: DisposalRequest) => void
  onCreateDisposal:() => void
  onSubmitReview:  (id: string) => void
  onApproveReview: (id: string) => void
  onApprove:       (id: string) => void
  onReject:        (disposal: DisposalRequest) => void
  onExecute:       (id: string) => void
  onComplete:      (id: string) => void
}

export function DisposalsTab({
  onViewDetail, onCreateDisposal, onSubmitReview, onApproveReview, onApprove, onReject, onExecute, onComplete,
}: DisposalsTabProps) {
  const currentUser = useAppSelector((state) => state.auth.user?.name ?? '')
  const { data: disposals = [], isLoading } = useDisposals()

  const [subView,       setSubView]       = useState<SubView>('all')
  const [search,        setSearch]        = useState('')
  const [statusFilter,  setStatusFilter]  = useState('all')
  const [methodFilter,  setMethodFilter]  = useState('all')
  const [columns,       setColumns]       = useState<AssetColumnConfig<DisposalRequest>[]>(defaultDisposalColumns)

  const counts = useMemo(() => ({
    total:             disposals.length,
    'pending-review':  disposals.filter((d) => d.status === 'pending-review').length,
    'pending-approval':disposals.filter((d) => d.status === 'pending-approval').length,
    approved:          disposals.filter((d) => d.status === 'approved').length,
    'in-progress':     disposals.filter((d) => d.status === 'in-progress').length,
    completed:         disposals.filter((d) => d.status === 'completed').length,
    rejected:          disposals.filter((d) => d.status === 'rejected').length,
  }), [disposals])

  const filtered = useMemo(() => {
    let list = disposals
    if (subView === 'mine')            list = list.filter((d) => d.requestedBy === currentUser)
    if (subView === 'pending-approval') list = list.filter((d) => d.status === 'pending-approval' || d.status === 'pending-review')
    if (subView === 'active')          list = list.filter((d) => d.status === 'approved' || d.status === 'in-progress')
    if (statusFilter !== 'all')        list = list.filter((d) => d.status === statusFilter)
    if (methodFilter !== 'all')        list = list.filter((d) => d.disposalMethod === methodFilter)
    if (search.trim())                 list = list.filter((d) =>
      d.disposalId.toLowerCase().includes(search.toLowerCase()) ||
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.requestedBy.toLowerCase().includes(search.toLowerCase()) ||
      d.fieldOffice.toLowerCase().includes(search.toLowerCase())
    )
    return list
  }, [disposals, subView, statusFilter, methodFilter, search, currentUser])

  const { page, rowsPerPage, setPage, setRowsPerPage, pageData } = useTablePagination(
    filtered,
    [search, statusFilter, methodFilter, subView],
  )

  const visibleCols = columns.filter((c) => c.visible)

  const subTabs: { key: SubView; label: string; badge?: number }[] = [
    { key: 'all',             label: 'All Disposals' },
    { key: 'mine',            label: 'My Requests' },
    { key: 'pending-approval', label: 'Pending Approval', badge: counts['pending-approval'] + counts['pending-review'] },
    { key: 'active',          label: 'Active',            badge: counts.approved + counts['in-progress'] },
  ]

  return (
    <div className="space-y-4">
      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {STAT_CARDS.map(({ key, label, color, Icon }) => (
          <div key={key} className="flex items-center gap-3 p-3 rounded-[4px] border bg-background">
            <div className={`w-9 h-9 rounded-[4px] ${color} flex items-center justify-center text-white shrink-0`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xl font-bold">{key === 'total' ? counts.total : counts[key as keyof typeof counts] ?? 0}</p>
              <p className="text-[13px] text-muted-foreground truncate">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Sub-view tabs + New Disposal button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-[4px]">
          {subTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSubView(tab.key)}
              className={`px-3 py-1.5 rounded-[4px] text-[15px] transition-colors flex items-center gap-1.5 ${
                subView === tab.key ? 'bg-[#121321] text-white shadow-sm' : 'text-foreground hover:bg-muted'
              }`}
            >
              {tab.label}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full text-[11px] font-medium ${
                  subView === tab.key ? 'bg-white/20 text-white' : 'bg-red-500 text-white'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
        <Button
          onClick={onCreateDisposal}
          className="gap-1.5 bg-brand-navy hover:bg-brand-navy-mid text-white text-[15px]"
        >
          <Plus className="w-4 h-4" />New Disposal
        </Button>
      </div>

      {/* Filter + Table card */}
      <Card>
        {/* Warning banner */}
        <div className="mx-4 mt-4 mb-3 flex items-center gap-2 px-4 py-2.5 rounded-[4px] bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-[15px] text-red-700 dark:text-red-400">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          Disposal is irreversible. Assets will be permanently locked once a disposal is completed.
        </div>

        {/* Filter bar */}
        <div className="px-4 pb-3 border-b">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID, title, requester, office…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-10 text-[15px] placeholder:text-muted-foreground/60"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select value={statusFilter} onValueChange={setStatusFilter}
                disabled={subView === 'pending-approval' || subView === 'active'}>
                <SelectTrigger className={`h-10 w-44 text-[15px] ${subView === 'pending-approval' || subView === 'active' ? 'opacity-60 cursor-not-allowed' : ''}`}>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-[15px]">All Status</SelectItem>
                  <SelectItem value="draft" className="text-[15px]">Draft</SelectItem>
                  <SelectItem value="pending-review" className="text-[15px]">Pending Review</SelectItem>
                  <SelectItem value="pending-approval" className="text-[15px]">Pending Approval</SelectItem>
                  <SelectItem value="approved" className="text-[15px]">Approved</SelectItem>
                  <SelectItem value="in-progress" className="text-[15px]">In Progress</SelectItem>
                  <SelectItem value="completed" className="text-[15px]">Completed</SelectItem>
                  <SelectItem value="rejected" className="text-[15px]">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger className="h-10 w-40 text-[15px]"><SelectValue placeholder="Method" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-[15px]">All Methods</SelectItem>
                  <SelectItem value="auction" className="text-[15px]">Auction</SelectItem>
                  <SelectItem value="donation" className="text-[15px]">Donation</SelectItem>
                  <SelectItem value="scrap" className="text-[15px]">Scrap</SelectItem>
                  <SelectItem value="write-off" className="text-[15px]">Write-Off</SelectItem>
                  <SelectItem value="trade-in" className="text-[15px]">Trade-In</SelectItem>
                  <SelectItem value="recycling" className="text-[15px]">Recycling</SelectItem>
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
                    <DropdownMenuCheckboxItem
                      key={String(col.key)}
                      checked={col.visible}
                      onCheckedChange={(checked) =>
                        setColumns((prev) => prev.map((c) => c.key === col.key ? { ...c, visible: checked } : c))
                      }
                      className="text-[15px]"
                    >
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

        {/* Table */}
        <CardContent className="p-0">
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground text-[15px]">Loading disposal requests…</div>
          ) : filtered.length > 0 ? (
            <div className="rounded-md border mx-4 mb-0 overflow-hidden mt-3">
              <div className="overflow-auto max-h-[calc(100vh-520px)] scrollbar-hide font-['Manrope']">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {visibleCols.map((col) => (
                        <TableHead key={String(col.key)} className="text-[15px] whitespace-nowrap">
                          {col.label}
                        </TableHead>
                      ))}
                      <TableHead className="w-20 text-[15px]" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pageData.map((disposal) => (
                      <TableRow
                        key={disposal.id}
                        className="cursor-pointer hover:bg-muted/30"
                        onClick={() => onViewDetail(disposal)}
                      >
                        {visibleCols.map((col) => (
                          <TableCell key={String(col.key)} className="text-[15px]">
                            {renderCell(disposal, col.key as keyof DisposalRequest)}
                          </TableCell>
                        ))}
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0"
                                onClick={(e) => e.stopPropagation()}>
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                              <DropdownMenuItem onClick={() => onViewDetail(disposal)} className="text-[15px]">View Detail</DropdownMenuItem>
                              {disposal.status === 'draft' && (
                                <DropdownMenuItem onClick={() => onSubmitReview(disposal.id)} className="text-[15px]">
                                  <FileText className="w-4 h-4 mr-2" />Submit for Review
                                </DropdownMenuItem>
                              )}
                              {disposal.status === 'pending-review' && (
                                <DropdownMenuItem onClick={() => onApproveReview(disposal.id)} className="text-[15px]">
                                  <CheckCheck className="w-4 h-4 mr-2" />Approve Finance Review
                                </DropdownMenuItem>
                              )}
                              {disposal.status === 'pending-approval' && (
                                <>
                                  <DropdownMenuItem onClick={() => onApprove(disposal.id)} className="text-[15px]">
                                    <CheckCheck className="w-4 h-4 mr-2" />Approve Disposal
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => onReject(disposal)}
                                    className="text-[15px] text-destructive focus:text-destructive">
                                    <XCircle className="w-4 h-4 mr-2" />Reject Disposal
                                  </DropdownMenuItem>
                                </>
                              )}
                              {disposal.status === 'approved' && (
                                <DropdownMenuItem onClick={() => onExecute(disposal.id)} className="text-[15px]">
                                  <Play className="w-4 h-4 mr-2" />Execute Disposal
                                </DropdownMenuItem>
                              )}
                              {disposal.status === 'in-progress' && (
                                <DropdownMenuItem onClick={() => onComplete(disposal.id)} className="text-[15px]">
                                  <CheckCheck className="w-4 h-4 mr-2" />Mark Completed
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <TablePagination
                totalItems={filtered.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={setPage}
                onRowsPerPageChange={setRowsPerPage}
                totalUnfilteredItems={disposals.length}
                itemLabel="disposals"
              />
            </div>
          ) : (
            <div className="text-center py-12 px-6">
              <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <h3 className="text-[15px] font-medium mb-1">No disposal requests found</h3>
              <p className="text-[15px] text-muted-foreground mb-4">
                {search || statusFilter !== 'all' || methodFilter !== 'all'
                  ? 'Try adjusting your filters.'
                  : 'Create a disposal request to begin the process.'}
              </p>
              {!search && statusFilter === 'all' && methodFilter === 'all' && (
                <Button size="sm" className="bg-brand-navy text-white text-[15px]" onClick={onCreateDisposal}>
                  <Plus className="w-4 h-4 mr-1.5" />New Disposal
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

const fmt = (n: number) => `$${n.toLocaleString()}`

function renderCell(disposal: DisposalRequest, key: keyof DisposalRequest): React.ReactNode {
  switch (key) {
    case 'disposalId':
      return <span className="font-medium">{disposal.disposalId}</span>
    case 'disposalMethod':
      return (
        <Badge variant="outline" className={`text-[12px] ${getDisposalMethodColor(disposal.disposalMethod)}`}>
          {getDisposalMethodLabel(disposal.disposalMethod)}
        </Badge>
      )
    case 'title':
      return (
        <div>
          <p className="font-medium max-w-[240px] truncate">{disposal.title}</p>
          <p className="text-[13px] text-muted-foreground">{disposal.assets.length} asset{disposal.assets.length !== 1 ? 's' : ''}</p>
        </div>
      )
    case 'status':
      return (
        <Badge variant="outline" className={`text-[12px] ${getDisposalStatusColor(disposal.status as DisposalStatus)}`}>
          {getDisposalStatusLabel(disposal.status as DisposalStatus)}
        </Badge>
      )
    case 'fieldOffice':
      return disposal.fieldOffice
    case 'requestedBy':
      return (
        <div>
          <p>{disposal.requestedBy}</p>
          <p className="text-[13px] text-muted-foreground">{new Date(disposal.requestedDate).toLocaleDateString()}</p>
        </div>
      )
    case 'totalNBV':
      return (
        <div>
          <p className="font-medium">{fmt(disposal.totalNBV)}</p>
          {disposal.writeOffAmount > 0 && (
            <p className="text-[13px] text-red-600">Write-off: {fmt(disposal.writeOffAmount)}</p>
          )}
        </div>
      )
    case 'targetDisposalDate':
      return (
        <div>
          <p>{new Date(disposal.targetDisposalDate).toLocaleDateString()}</p>
          {disposal.actualDisposalDate && (
            <p className="text-[13px] text-green-600">Done {new Date(disposal.actualDisposalDate).toLocaleDateString()}</p>
          )}
        </div>
      )
    case 'linkedSurveyId':
      return disposal.linkedSurveyId
        ? <span className="text-brand-teal">{disposal.linkedSurveyId}</span>
        : <span className="text-muted-foreground">—</span>
    case 'totalAcquisitionValue': return fmt(disposal.totalAcquisitionValue)
    case 'totalDisposalValue':    return fmt(disposal.totalDisposalValue)
    case 'writeOffAmount':        return disposal.writeOffAmount > 0 ? <span className="text-red-600 font-medium">{fmt(disposal.writeOffAmount)}</span> : '—'
    default: return null
  }
}
