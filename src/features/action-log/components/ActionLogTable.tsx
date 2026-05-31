import { useMemo, useState } from 'react'
import { Search, Download, Eye, FileText, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { TablePagination } from '@/components/shared'
import { useTablePagination } from '@/hooks/useTablePagination'
import { ENTITY_TYPES, EVENT_TYPES } from '../constants/filterOptions'
import { formatLogTimestamp } from '../lib/formatUtils'
import type { AuditLog } from '../types'

const FIELD_TEXT = 'text-[15px]'

interface ActionLogTableProps {
  logs: AuditLog[]
  isLoading: boolean
  onViewDetail: (log: AuditLog) => void
}

export function ActionLogTable({ logs, isLoading, onViewDetail }: ActionLogTableProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [entityFilter, setEntityFilter] = useState('all')
  const [eventFilter, setEventFilter] = useState('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const filteredLogs = useMemo(() => {
    const q = searchQuery.toLowerCase()
    return logs.filter((log) => {
      const matchesSearch =
        !q ||
        log.event_type.toLowerCase().includes(q) ||
        log.actor_name.toLowerCase().includes(q) ||
        log.entity_type.toLowerCase().includes(q) ||
        log.entity_id.toLowerCase().includes(q) ||
        (log.justification?.reason ?? '').toLowerCase().includes(q)
      const matchesEntity = entityFilter === 'all' || log.entity_type === entityFilter
      const matchesEvent = eventFilter === 'all' || log.event_type === eventFilter
      const logDate = log.timestamp.slice(0, 10)
      const matchesFrom = !dateFrom || logDate >= dateFrom
      const matchesTo = !dateTo || logDate <= dateTo
      return matchesSearch && matchesEntity && matchesEvent && matchesFrom && matchesTo
    })
  }, [logs, searchQuery, entityFilter, eventFilter, dateFrom, dateTo])

  const { page, rowsPerPage, setPage, setRowsPerPage, pageData } = useTablePagination(
    filteredLogs,
    [searchQuery, entityFilter, eventFilter, dateFrom, dateTo],
  )

  const hasActiveFilters =
    !!searchQuery ||
    entityFilter !== 'all' ||
    eventFilter !== 'all' ||
    !!dateFrom ||
    !!dateTo

  const clearFilters = () => {
    setSearchQuery('')
    setEntityFilter('all')
    setEventFilter('all')
    setDateFrom('')
    setDateTo('')
    setPage(0)
    toast.info('All filters cleared')
  }

  if (isLoading) {
    return <div className="p-6 text-muted-foreground text-[15px]">Loading action log…</div>
  }

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search actor, entity, reason…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-9 ${FIELD_TEXT}`}
              />
            </div>

            <Select value={entityFilter} onValueChange={setEntityFilter}>
              <SelectTrigger className={`w-44 ${FIELD_TEXT} pr-2 [&>svg]:right-2`}>
                <SelectValue placeholder="Entity Type" />
              </SelectTrigger>
              <SelectContent className={FIELD_TEXT}>
                <SelectItem value="all" className={FIELD_TEXT}>All Entity Types</SelectItem>
                {ENTITY_TYPES.map((e) => (
                  <SelectItem key={e} value={e} className={FIELD_TEXT}>{e}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={eventFilter} onValueChange={setEventFilter}>
              <SelectTrigger className={`w-40 ${FIELD_TEXT} pr-2 [&>svg]:right-2`}>
                <SelectValue placeholder="Action Type" />
              </SelectTrigger>
              <SelectContent className={FIELD_TEXT}>
                <SelectItem value="all" className={FIELD_TEXT}>All Actions</SelectItem>
                {EVENT_TYPES.map((a) => (
                  <SelectItem key={a} value={a} className={FIELD_TEXT}>{a}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Label htmlFor="date-from" className="text-[14px] text-muted-foreground whitespace-nowrap">
                From
              </Label>
              <input
                id="date-from"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className={`h-10 rounded-md border border-input bg-background px-3 ${FIELD_TEXT} text-foreground focus:outline-none focus:ring-2 focus:ring-ring`}
              />
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="date-to" className="text-[14px] text-muted-foreground whitespace-nowrap">
                To
              </Label>
              <input
                id="date-to"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className={`h-10 rounded-md border border-input bg-background px-3 ${FIELD_TEXT} text-foreground focus:outline-none focus:ring-2 focus:ring-ring`}
              />
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.info('Downloading logs in Excel…')}
                  className="h-10 w-10"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Download as Excel</p></TooltipContent>
            </Tooltip>

            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters} className={FIELD_TEXT}>
                <X className="w-4 h-4 mr-1.5" /> Clear
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-[14px] text-muted-foreground mb-3">
            Showing {pageData.length} of {filteredLogs.length} entries
          </p>

          <div className="rounded-md border overflow-hidden">
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={FIELD_TEXT}>Date & Time</TableHead>
                    <TableHead className={FIELD_TEXT}>Actor</TableHead>
                    <TableHead className={FIELD_TEXT}>Entity Type</TableHead>
                    <TableHead className={FIELD_TEXT}>Action</TableHead>
                    <TableHead className={FIELD_TEXT}>Reason</TableHead>
                    <TableHead className={`w-16 ${FIELD_TEXT}`}>View</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageData.map((log) => {
                    const { date, time } = formatLogTimestamp(log.timestamp)
                    return (
                      <TableRow
                        key={log.id}
                        className="cursor-pointer hover:bg-muted/40 transition-colors"
                        onClick={() => onViewDetail(log)}
                      >
                        <TableCell className="whitespace-nowrap">
                          <p className={`${FIELD_TEXT} font-medium tabular-nums`}>{date}</p>
                          <p className="text-[13px] text-muted-foreground tabular-nums">{time}</p>
                        </TableCell>
                        <TableCell>
                          <p className={`${FIELD_TEXT} font-medium`}>{log.actor_name}</p>
                          <p className="text-[13px] text-muted-foreground">{log.actor_role_at_time}</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[13px] px-2.5 py-1">
                            {log.entity_type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[13px] px-2.5 py-1">
                            {log.event_type}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[200px]">
                          <p className={`${FIELD_TEXT} truncate text-muted-foreground`}>
                            {log.justification?.reason ?? '—'}
                          </p>
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-9 w-9 p-0"
                            onClick={() => onViewDetail(log)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            {filteredLogs.length === 0 && (
              <div className="text-center py-10 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className={FIELD_TEXT}>No log entries found</p>
              </div>
            )}
          </div>

          <TablePagination
            totalItems={filteredLogs.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={setPage}
            onRowsPerPageChange={setRowsPerPage}
            totalUnfilteredItems={logs.length}
            itemLabel="entries"
          />
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
