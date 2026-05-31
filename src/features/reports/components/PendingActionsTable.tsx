import {
  AlertCircle,
  CheckCircle,
  ClipboardCheck,
  Eye,
  Gavel,
  Package,
  Search,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable, type DataTableColumn } from '@/components/shared/DataTable'
import { formatDate } from '@/lib/utils/dateFormatter'
import type { PendingAction } from '../types'

interface PendingActionsTableProps {
  actions: PendingAction[]
  onViewDetail: (action: PendingAction) => void
}

function actionIcon(type: PendingAction['type']) {
  switch (type) {
    case 'inspection':
      return <Search className="h-4 w-4" />
    case 'disposal':
      return <Gavel className="h-4 w-4" />
    case 'transfer':
      return <Package className="h-4 w-4" />
    case 'tagging':
      return <ClipboardCheck className="h-4 w-4" />
    case 'verification':
      return <CheckCircle className="h-4 w-4" />
  }
}

export function PendingActionsTable({ actions, onViewDetail }: PendingActionsTableProps) {
  const columns: DataTableColumn<PendingAction>[] = [
    {
      key: 'type',
      header: 'Type',
      render: (row) => (
        <div className="flex items-center gap-2 capitalize">
          {actionIcon(row.type)}
          <span className="font-medium">{row.type}</span>
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      className: 'max-w-xs',
      render: (row) => row.description,
    },
    {
      key: 'assetCount',
      header: 'Assets',
      render: (row) => (
        <Badge variant="outline" className="text-sm">
          {row.assetCount}
        </Badge>
      ),
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      render: (row) => {
        const isOverdue = new Date(row.dueDate) < new Date()
        return (
          <span className={isOverdue ? 'font-medium text-destructive' : undefined}>
            {formatDate(row.dueDate)}
            {isOverdue && <span className="ml-1 text-sm">(overdue)</span>}
          </span>
        )
      },
    },
    {
      key: 'assignedTo',
      header: 'Assigned To',
      accessor: (row) => row.assignedTo,
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={actions}
      keyExtractor={(row) => row.id}
      onRowClick={onViewDetail}
      paginated={false}
      itemLabel="actions"
      actionsColumn={(row) => (
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0"
          onClick={(e) => {
            e.stopPropagation()
            onViewDetail(row)
          }}
          aria-label="View pending action"
        >
          <Eye className="h-4 w-4" />
        </Button>
      )}
      emptyMessage="No pending actions"
    />
  )
}
