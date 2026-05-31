import { ArrowDown, ArrowUp, Lock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AVAILABLE_FIELDS } from '../constants/reportingData'
import type { ReportRow, ReportSortOrder } from '../types'
import { getGroupedResults } from '../utils/reportResults'

interface ReportResultsTableProps {
  rows: ReportRow[]
  selectedFields: string[]
  groupBy: string
  sortBy: string
  sortOrder: ReportSortOrder
  onSort: (field: string) => void
}

export function ReportResultsTable({
  rows,
  selectedFields,
  groupBy,
  sortBy,
  sortOrder,
  onSort,
}: ReportResultsTableProps) {
  const grouped = getGroupedResults(rows, groupBy)

  if (grouped) {
    return (
      <div className="space-y-6">
        {Object.entries(grouped).map(([groupKey, items]) => (
          <div key={groupKey}>
            <div className="mb-3 flex items-center gap-2">
              <Badge className="bg-brand-navy px-3 py-1 text-sm text-white">
                {AVAILABLE_FIELDS.find((f) => f.id === groupBy)?.label || groupBy}: {groupKey}
              </Badge>
              <span className="text-sm font-medium text-muted-foreground">({items.length} assets)</span>
            </div>
            <ResultsTableBody
              rows={items}
              selectedFields={selectedFields}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSort}
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <ResultsTableBody
      rows={rows}
      selectedFields={selectedFields}
      sortBy={sortBy}
      sortOrder={sortOrder}
      onSort={onSort}
    />
  )
}

function ResultsTableBody({
  rows,
  selectedFields,
  sortBy,
  sortOrder,
  onSort,
}: Omit<ReportResultsTableProps, 'groupBy'>) {
  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            {selectedFields.map((fieldId) => {
              const field = AVAILABLE_FIELDS.find((f) => f.id === fieldId)
              const isSortField = sortBy === fieldId
              return (
                <TableHead
                  key={fieldId}
                  className="cursor-pointer select-none whitespace-nowrap py-3 text-base font-semibold"
                  onClick={() => onSort(fieldId)}
                >
                  <span className="flex items-center gap-1">
                    {field?.label || fieldId}
                    {field?.sensitive && <Lock className="h-3.5 w-3.5 text-muted-foreground" />}
                    {isSortField &&
                      (sortOrder === 'asc' ? (
                        <ArrowUp className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowDown className="h-3.5 w-3.5" />
                      ))}
                  </span>
                </TableHead>
              )
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={selectedFields.length}
                className="py-16 text-center text-base text-muted-foreground"
              >
                No data available
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, index) => (
              <TableRow key={`${row.assetId}-${index}`} className="hover:bg-muted/30">
                {selectedFields.map((fieldId) => (
                  <TableCell key={fieldId} className="whitespace-nowrap py-3 text-base">
                    {(row as Record<string, string | undefined>)[fieldId] || '—'}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
