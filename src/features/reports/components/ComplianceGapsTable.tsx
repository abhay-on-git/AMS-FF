import { Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable, type DataTableColumn } from '@/components/shared/DataTable'
import type { ComplianceGap } from '../types'

interface ComplianceGapsTableProps {
  gaps: ComplianceGap[]
  onViewDetail: (gap: ComplianceGap) => void
}

export function ComplianceGapsTable({ gaps, onViewDetail }: ComplianceGapsTableProps) {
  const columns: DataTableColumn<ComplianceGap>[] = [
    {
      key: 'type',
      header: 'Gap Type',
      render: (row) => <span className="font-medium">{row.type}</span>,
    },
    {
      key: 'count',
      header: 'Count',
      render: (row) => (
        <Badge variant="outline" className="text-sm">
          {row.count} assets
        </Badge>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={gaps}
      keyExtractor={(row) => row.type}
      onRowClick={onViewDetail}
      paginated={false}
      itemLabel="gaps"
      actionsColumn={(row) => (
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0"
          onClick={(e) => {
            e.stopPropagation()
            onViewDetail(row)
          }}
          aria-label="View compliance gap"
        >
          <Eye className="h-4 w-4" />
        </Button>
      )}
      emptyMessage="No compliance gaps"
    />
  )
}
