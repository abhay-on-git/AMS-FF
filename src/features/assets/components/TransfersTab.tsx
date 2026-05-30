import { useState, useMemo } from 'react'
import {
  Plus, MoreHorizontal, Columns3, Download, Search,
  ArrowRight, RefreshCw, ArrowLeftRight, Truck, Bell,
  CheckCheck, Clock, PenLine, FileText,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { useTransfers } from '../hooks/useAssets'
import { useAppSelector } from '@/store/hooks'
import { defaultTransferColumns } from '../constants/transferColumns'
import {
  getTransferStatusColor, getTransferStatusLabel,
  getTransferTypeColor, getTransferTypeLabel,
} from '../types/transferTypes'
import { TRANSFER_FIELD_OFFICES } from '../constants/transferConstants'
import type { AssetColumnConfig } from '../types'
import type { TransferRequest, TransferStatus } from '../types/transferTypes'

type SubView = 'all' | 'mine' | 'pending-approvals' | 'pending-ack'

interface TransfersTabProps {
  onViewDetail:  (transfer: TransferRequest) => void
  onInitiate:    () => void
  onApprove:     (id: string) => void
  onReject:      (transfer: TransferRequest) => void
  onAcknowledge: (id: string) => void
}

function SignatureDots({ signatures }: { signatures: TransferRequest['signatures'] }) {
  if (!signatures.length) return <span className="text-[15px] text-muted-foreground">—</span>
  const signed = signatures.filter((s) => s.status === 'signed').length
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {signatures.map((s, i) => (
          <div key={i} className={`w-2.5 h-2.5 rounded-full ${
            s.status === 'signed' ? 'bg-green-500' :
            s.status === 'declined' ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'
          }`} />
        ))}
      </div>
      <span className="text-[13px] text-muted-foreground">{signed}/{signatures.length}</span>
    </div>
  )
}

const STAT_CARDS = [
  { key: 'total',          label: 'Total',             color: 'bg-[#121321]', Icon: ArrowLeftRight },
  { key: 'pendingCustodian', label: 'Awaiting Custodian', color: 'bg-cyan-600',  Icon: PenLine },
  { key: 'pending',        label: 'Pending Approval',  color: 'bg-amber-600', Icon: Clock },
  { key: 'inTransit',      label: 'In Transit',        color: 'bg-indigo-600',Icon: Truck },
  { key: 'pendingAck',     label: 'Pending Ack.',      color: 'bg-purple-600',Icon: Bell },
  { key: 'completed',      label: 'Completed',         color: 'bg-green-600', Icon: CheckCheck },
  { key: 'drafts',         label: 'Drafts',            color: 'bg-gray-500',  Icon: FileText },
] as const

export function TransfersTab({ onViewDetail, onInitiate, onApprove, onReject, onAcknowledge }: TransfersTabProps) {
  const currentUser = useAppSelector((state) => state.auth.user?.name ?? '')
  const { data: transfers = [], isLoading } = useTransfers()

  const [subView,       setSubView]       = useState<SubView>('all')
  const [search,        setSearch]        = useState('')
  const [statusFilter,  setStatusFilter]  = useState('all')
  const [typeFilter,    setTypeFilter]    = useState('all')
  const [officeFilter,  setOfficeFilter]  = useState('all')
  const [columns,       setColumns]       = useState<AssetColumnConfig[]>(defaultTransferColumns)

  const toggleColumn = (key: string) =>
    setColumns((prev) => prev.map((c) => c.key === key ? { ...c, visible: !c.visible } : c))

  // Sub-view locks certain filters
  const isLocked            = subView === 'pending-approvals' || subView === 'pending-ack'
  const effectiveStatus     = subView === 'pending-approvals' ? 'pending-approval'
                            : subView === 'pending-ack'       ? 'pending-acknowledgment'
                            : statusFilter
  const effectiveType       = isLocked ? 'all' : typeFilter
  const effectiveOffice     = isLocked ? 'all' : officeFilter

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return transfers.filter((t) => {
      const matchSearch = !q ||
        t.transferId.toLowerCase().includes(q) ||
        t.fromCustodian.toLowerCase().includes(q) ||
        t.toCustodian.toLowerCase().includes(q) ||
        t.reason.toLowerCase().includes(q) ||
        t.fromFieldOffice.toLowerCase().includes(q) ||
        t.toFieldOffice.toLowerCase().includes(q)
      const matchStatus = effectiveStatus === 'all' || t.status === effectiveStatus
      const matchType   = effectiveType   === 'all' || t.transferType === effectiveType
      const matchOffice = effectiveOffice === 'all' ||
        t.fromFieldOffice === effectiveOffice || t.toFieldOffice === effectiveOffice
      const matchView   =
        subView === 'mine'              ? t.initiatedBy === currentUser : true
      return matchSearch && matchStatus && matchType && matchOffice && matchView
    })
  }, [transfers, search, effectiveStatus, effectiveType, effectiveOffice, subView])

  const stats = useMemo(() => ({
    total:           transfers.length,
    pendingCustodian:transfers.filter((t) => t.status === 'pending-custodian').length,
    pending:         transfers.filter((t) => t.status === 'pending-approval').length,
    inTransit:       transfers.filter((t) => t.status === 'in-transit').length,
    pendingAck:      transfers.filter((t) => t.status === 'pending-acknowledgment').length,
    completed:       transfers.filter((t) => t.status === 'completed').length,
    drafts:          transfers.filter((t) => t.status === 'draft').length,
  }), [transfers])

  if (isLoading) return <div className="p-6 text-muted-foreground">Loading transfers...</div>

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

      {/* Sub-view tabs + Initiate button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-[4px]">
          {([
            { value: 'all',               label: 'All Transfers' },
            { value: 'mine',              label: 'My Transfers' },
            { value: 'pending-approvals', label: 'Pending Approvals', badge: stats.pending },
            { value: 'pending-ack',       label: 'Pending Ack.',      badge: stats.pendingAck },
          ] as { value: SubView; label: string; badge?: number }[]).map((tab) => (
            <button key={tab.value} onClick={() => setSubView(tab.value)}
              className={`px-3 py-1.5 rounded-[4px] text-[15px] transition-colors flex items-center gap-1.5 ${
                subView === tab.value
                  ? 'bg-[#121321] text-white shadow-sm'
                  : 'text-foreground hover:bg-muted'
              }`}>
              {tab.label}
              {tab.badge != null && tab.badge > 0 && (
                <span className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full text-[11px] font-medium ${
                  subView === tab.value ? 'bg-white/20 text-white' : 'bg-amber-500 text-white'
                }`}>{tab.badge}</span>
              )}
            </button>
          ))}
        </div>
        <Button onClick={onInitiate}
          className="gap-1.5 bg-brand-navy hover:bg-brand-navy-mid text-white text-[15px]">
          <Plus className="w-4 h-4" />
          Initiate Transfer
        </Button>
      </div>

      {/* Filter + Table card */}
      <Card>
        <div className="px-4 pt-4 pb-3 border-b">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search transfer ID, custodian, reason, field office..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-10 text-[15px] placeholder:text-muted-foreground/60"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select
                value={effectiveStatus}
                onValueChange={(v) => setStatusFilter(v)}
                disabled={isLocked}
              >
                <SelectTrigger className={`w-[165px] h-10 text-[15px] ${isLocked ? 'opacity-60 cursor-not-allowed' : ''}`}>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-[15px]">All Status</SelectItem>
                  <SelectItem value="draft" className="text-[15px]">Draft</SelectItem>
                  <SelectItem value="pending-custodian" className="text-[15px]">Pending Custodian</SelectItem>
                  <SelectItem value="pending-approval" className="text-[15px]">Pending Approval</SelectItem>
                  <SelectItem value="approved" className="text-[15px]">Approved</SelectItem>
                  <SelectItem value="in-transit" className="text-[15px]">In Transit</SelectItem>
                  <SelectItem value="pending-acknowledgment" className="text-[15px]">Pending Ack.</SelectItem>
                  <SelectItem value="completed" className="text-[15px]">Completed</SelectItem>
                  <SelectItem value="rejected" className="text-[15px]">Rejected</SelectItem>
                  <SelectItem value="cancelled" className="text-[15px]">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={effectiveType} onValueChange={setTypeFilter} disabled={isLocked}>
                <SelectTrigger className={`w-[145px] h-10 text-[15px] ${isLocked ? 'opacity-60 cursor-not-allowed' : ''}`}>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-[15px]">All Types</SelectItem>
                  <SelectItem value="intra-field" className="text-[15px]">Intra-Field</SelectItem>
                  <SelectItem value="inter-field" className="text-[15px]">Inter-Field</SelectItem>
                </SelectContent>
              </Select>

              <Select value={effectiveOffice} onValueChange={setOfficeFilter} disabled={isLocked}>
                <SelectTrigger className={`w-[160px] h-10 text-[15px] ${isLocked ? 'opacity-60 cursor-not-allowed' : ''}`}>
                  <SelectValue placeholder="Field Office" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-[15px]">All Offices</SelectItem>
                  {TRANSFER_FIELD_OFFICES.map((o) => (
                    <SelectItem key={o} value={o} className="text-[15px]">{o}</SelectItem>
                  ))}
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
                      <TableHead className="text-[15px]">Transfer ID</TableHead>
                      <TableHead className="text-[15px]">Type</TableHead>
                      <TableHead className="text-[15px]">From</TableHead>
                      <TableHead className="w-6" />
                      <TableHead className="text-[15px]">To</TableHead>
                      <TableHead className="text-[15px] text-center">Assets</TableHead>
                      <TableHead className="text-[15px]">Status</TableHead>
                      <TableHead className="text-[15px]">Date</TableHead>
                      <TableHead className="text-[15px]">Signatures</TableHead>
                      <TableHead className="w-20 text-[15px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((t) => (
                      <TableRow key={t.id} className="cursor-pointer hover:bg-muted/30" onClick={() => onViewDetail(t)}>
                        <TableCell className="font-medium text-[15px] text-brand-navy dark:text-brand-teal">
                          {t.transferId}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-[12px] ${getTransferTypeColor(t.transferType)}`}>
                            {getTransferTypeLabel(t.transferType)}
                          </Badge>
                        </TableCell>
                        <TableCell className="min-w-[140px]">
                          <p className="text-[15px] font-medium truncate">{t.fromCustodian}</p>
                          <p className="text-[13px] text-muted-foreground truncate">{t.fromFieldOffice} · {t.fromRoom || t.fromLocation}</p>
                        </TableCell>
                        <TableCell className="px-1">
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        </TableCell>
                        <TableCell className="min-w-[140px]">
                          <p className="text-[15px] font-medium truncate">{t.toCustodian || <span className="italic text-muted-foreground">TBD</span>}</p>
                          <p className="text-[13px] text-muted-foreground truncate">{t.toFieldOffice} · {t.toRoom || t.toLocation || '—'}</p>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted text-[15px] font-medium">
                            {t.assets.length}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-[12px] whitespace-nowrap ${getTransferStatusColor(t.status as TransferStatus)}`}>
                            {getTransferStatusLabel(t.status as TransferStatus)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-[15px] text-muted-foreground whitespace-nowrap">
                          {new Date(t.initiatedDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <SignatureDots signatures={t.signatures} />
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
                              <DropdownMenuItem onClick={() => onViewDetail(t)}>View Detail</DropdownMenuItem>
                              {t.status === 'pending-approval' && (
                                <DropdownMenuItem onClick={() => onApprove(t.id)}>Approve</DropdownMenuItem>
                              )}
                              {(t.status === 'pending-approval' || t.status === 'pending-custodian') && (
                                <DropdownMenuItem onClick={() => onReject(t)}>Reject</DropdownMenuItem>
                              )}
                              {t.status === 'pending-acknowledgment' && (
                                <DropdownMenuItem onClick={() => onAcknowledge(t.id)}>Acknowledge</DropdownMenuItem>
                              )}
                              {(t.status === 'draft' || t.status === 'pending-custodian') && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive focus:text-destructive">
                                    Cancel Transfer
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 px-6">
              <RefreshCw className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <h3 className="text-lg font-medium mb-1">No transfers found</h3>
              <p className="text-[15px] text-muted-foreground mb-4">
                {isLocked
                  ? `No ${subView === 'pending-approvals' ? 'pending approval' : 'pending acknowledgment'} transfers`
                  : search || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Initiate a transfer to get started'}
              </p>
              {!isLocked && (search || statusFilter !== 'all') ? (
                <Button variant="outline" size="sm"
                  onClick={() => { setSearch(''); setStatusFilter('all'); setTypeFilter('all'); setOfficeFilter('all') }}>
                  Clear Filters
                </Button>
              ) : (
                <Button size="sm" onClick={onInitiate}
                  className="bg-brand-navy hover:bg-brand-navy-mid text-white">
                  <Plus className="w-4 h-4 mr-1.5" />Initiate Transfer
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
