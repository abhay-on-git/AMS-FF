import { ReactNode, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { cn } from '@/lib/cn'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export interface DataTableColumn<T> {
  key: string
  header: string
  render?: (row: T) => ReactNode
  accessor?: (row: T) => string | number | undefined
  visible?: boolean
  sortable?: boolean
  className?: string
  headerClassName?: string
  width?: string
}

type SortDirection = 'asc' | 'desc' | null

interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  data: T[]
  keyExtractor: (row: T) => string | number
  onRowClick?: (row: T) => void
  emptyState?: ReactNode
  emptyMessage?: string
  className?: string
  paginated?: boolean
  defaultRowsPerPage?: number
  rowsPerPageOptions?: number[]
  itemLabel?: string
  stickyHeader?: boolean
  maxHeight?: string
  rowClassName?: (row: T) => string
  actionsColumn?: (row: T) => ReactNode
  actionsHeader?: string
  actionsWidth?: string
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyState,
  emptyMessage = 'No data found',
  className,
  paginated = true,
  defaultRowsPerPage = 10,
  rowsPerPageOptions = [5, 10, 25, 50, 100],
  itemLabel = 'items',
  stickyHeader = false,
  maxHeight = 'calc(100vh - 420px)',
  rowClassName,
  actionsColumn,
  actionsHeader = 'Actions',
  actionsWidth = 'w-20',
}: DataTableProps<T>) {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage)
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  const visibleColumns = useMemo(
    () => columns.filter((col) => col.visible !== false),
    [columns],
  )

  const sortedData = useMemo(() => {
    if (!sortKey || !sortDirection) return data
    const col = columns.find((c) => c.key === sortKey)
    if (!col?.accessor) return data

    return [...data].sort((a, b) => {
      const aVal = col.accessor!(a)
      const bVal = col.accessor!(b)
      if (aVal === undefined && bVal === undefined) return 0
      if (aVal === undefined) return 1
      if (bVal === undefined) return -1
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [data, sortKey, sortDirection, columns])

  const totalPages = Math.max(1, Math.ceil(sortedData.length / rowsPerPage))
  const pageData = paginated
    ? sortedData.slice(page * rowsPerPage, (page + 1) * rowsPerPage)
    : sortedData

  const startItem = sortedData.length === 0 ? 0 : page * rowsPerPage + 1
  const endItem = Math.min((page + 1) * rowsPerPage, sortedData.length)

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') setSortDirection('desc')
      else if (sortDirection === 'desc') { setSortKey(null); setSortDirection(null) }
      else setSortDirection('asc')
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
    setPage(0)
  }

  if (sortedData.length === 0) {
    if (emptyState) return <>{emptyState}</>
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 opacity-30 bg-muted rounded-lg flex items-center justify-center">
          <Search className="w-8 h-8" />
        </div>
        <h3 className="text-lg mb-2">{emptyMessage}</h3>
        <p className="text-[15px] text-muted-foreground">Try adjusting your search criteria or removing some filters</p>
      </div>
    )
  }

  return (
    <div className={cn('rounded-md border overflow-hidden', className)}>
      <div className={cn('overflow-auto scrollbar-hide', stickyHeader && 'relative')} style={{ maxHeight }}>
        <table className="w-full text-[15px] font-['Manrope']">
          <thead className={cn(stickyHeader && 'sticky top-0 z-10 bg-background')}>
            <tr className="border-b bg-muted/30">
              {visibleColumns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'px-4 py-3 text-left font-medium text-muted-foreground text-[15px]',
                    col.sortable && 'cursor-pointer select-none hover:text-foreground',
                    col.headerClassName,
                  )}
                  style={col.width ? { width: col.width } : undefined}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                >
                  <span className="flex items-center gap-1">
                    {col.header}
                    {col.sortable && (
                      sortKey === col.key
                        ? sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />
                        : <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />
                    )}
                  </span>
                </th>
              ))}
              {actionsColumn && (
                <th className={cn('px-4 py-3 text-left font-medium text-muted-foreground text-[15px]', actionsWidth)}>
                  {actionsHeader}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {pageData.map((row) => (
              <tr
                key={keyExtractor(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn(
                  'border-b last:border-b-0 transition-colors',
                  onRowClick && 'cursor-pointer hover:bg-muted/50',
                  rowClassName?.(row),
                )}
              >
                {visibleColumns.map((col) => (
                  <td key={col.key} className={cn('px-4 py-3 text-foreground', col.className)}>
                    {col.render ? col.render(row) : col.accessor ? String(col.accessor(row) ?? '—') : '—'}
                  </td>
                ))}
                {actionsColumn && (
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    {actionsColumn(row)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {paginated && (
        <div className="flex items-center justify-between gap-4 px-4 py-2 border-t bg-background text-[15px] text-muted-foreground">
          <div className="whitespace-nowrap">
            Showing {sortedData.length} of {data.length} {itemLabel}
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <div className="flex items-center gap-2">
              <span className="whitespace-nowrap">Rows per page:</span>
              <Select
                value={String(rowsPerPage)}
                onValueChange={(val) => { setRowsPerPage(Number(val)); setPage(0) }}
              >
                <SelectTrigger className="h-8 w-[70px] border-0 bg-white shadow-none focus:ring-0 px-2 text-[15px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {rowsPerPageOptions.map((opt) => (
                    <SelectItem key={opt} value={String(opt)} className="text-[15px]">{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <span className="whitespace-nowrap">{startItem}–{endItem} of {sortedData.length}</span>

            <div className="flex items-center gap-0.5">
              <button onClick={() => setPage(0)} disabled={page === 0}
                className="inline-flex items-center justify-center w-8 h-8 rounded-full disabled:opacity-30 disabled:pointer-events-none transition-colors" aria-label="First page">
                <ChevronsLeft className="w-5 h-5" />
              </button>
              <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}
                className="inline-flex items-center justify-center w-8 h-8 rounded-full disabled:opacity-30 disabled:pointer-events-none transition-colors" aria-label="Previous page">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1}
                className="inline-flex items-center justify-center w-8 h-8 rounded-full disabled:opacity-30 disabled:pointer-events-none transition-colors" aria-label="Next page">
                <ChevronRight className="w-5 h-5" />
              </button>
              <button onClick={() => setPage(totalPages - 1)} disabled={page >= totalPages - 1}
                className="inline-flex items-center justify-center w-8 h-8 rounded-full disabled:opacity-30 disabled:pointer-events-none transition-colors" aria-label="Last page">
                <ChevronsRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
