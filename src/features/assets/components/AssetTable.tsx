import { Eye, Pencil, MoreVertical, Search, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { TablePagination } from '@/components/shared'
import { useTablePagination } from '@/hooks/useTablePagination'
import type { EnhancedAsset, AssetColumnConfig } from '../types'

interface AssetTableProps {
  assets: EnhancedAsset[]
  columns: AssetColumnConfig[]
  onViewDetail: (asset: EnhancedAsset) => void
  onEdit: (asset: EnhancedAsset) => void
  emptyMessage?: string
}

export function AssetTable({ assets, columns, onViewDetail, onEdit, emptyMessage }: AssetTableProps) {
  const { page, rowsPerPage, setPage, setRowsPerPage, pageData } = useTablePagination(assets)

  const visibleColumns = columns.filter((c) => c.visible)

  if (assets.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 opacity-30 bg-muted rounded-lg flex items-center justify-center">
          <Search className="w-8 h-8" />
        </div>
        <h3 className="text-lg mb-2">{emptyMessage || 'No assets found'}</h3>
        <p className="text-[15px] text-muted-foreground">Try adjusting your search criteria or removing some filters</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-auto max-h-[calc(100vh-420px)] scrollbar-hide font-['Manrope']">
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumns.map((col) => (
                <TableHead key={col.key} className="text-[15px]">{col.label}</TableHead>
              ))}
              <TableHead className="w-20 text-[15px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageData.map((asset) => (
              <TableRow
                key={asset.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onViewDetail(asset)}
              >
                {visibleColumns.map((col) => (
                  <TableCell key={col.key} className="text-foreground text-[15px]">
                    {renderCell(asset, col.key)}
                  </TableCell>
                ))}
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewDetail(asset)}>
                        <Eye className="w-4 h-4 mr-2" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(asset)}>
                        <Pencil className="w-4 h-4 mr-2" /> Edit
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        totalItems={assets.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
        totalUnfilteredItems={assets.length}
        itemLabel="assets"
      />
    </div>
  )
}

function renderCell(asset: EnhancedAsset, key: string) {
  switch (key) {
    case 'assetId':
      return (
        <span className="font-medium flex items-center gap-1.5">
          {asset.assetId}
          {asset.isLocked && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Lock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">{asset.lockReason || 'Asset locked'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </span>
      )
    case 'epc':
      return <span className="text-[15px]">{asset.epc}</span>
    case 'barcode':
      return <span className="text-[15px]">{asset.barcode}</span>
    case 'type':
      return asset.type
    case 'name':
      return asset.name
    case 'location':
      return asset.location
    case 'publishedDate':
      return <span className="whitespace-nowrap">{asset.publishedDate}</span>
    case 'custodian':
      return asset.responsiblePerson
    case 'fieldOffice':
      return asset.fieldOffice
    case 'lastStatusChange':
      return <span className="whitespace-nowrap">{asset.lastStatusChange}</span>
    case 'lastLocationUpdate':
      return <span className="whitespace-nowrap">{asset.lastLocationUpdate}</span>
    case 'lastCustodianChange':
      return <span className="whitespace-nowrap">{asset.lastCustodianChange}</span>
    case 'condition':
      return asset.condition
    case 'nbv':
      return asset.nbv !== undefined ? `$${asset.nbv.toLocaleString()}` : '—'
    default:
      return '—'
  }
}
