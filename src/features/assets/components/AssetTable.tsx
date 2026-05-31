import { useState } from 'react'
import { Eye, Pencil, MoreVertical, Search, Lock, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { EnhancedAsset, AssetColumnConfig } from '../types'

interface AssetTableProps {
  assets: EnhancedAsset[]
  columns: AssetColumnConfig[]
  onViewDetail: (asset: EnhancedAsset) => void
  onEdit: (asset: EnhancedAsset) => void
  emptyMessage?: string
}

export function AssetTable({ assets, columns, onViewDetail, onEdit, emptyMessage }: AssetTableProps) {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const visibleColumns = columns.filter((c) => c.visible)
  const totalPages = Math.max(1, Math.ceil(assets.length / rowsPerPage))
  const pageData = assets.slice(page * rowsPerPage, (page + 1) * rowsPerPage)
  const startItem = assets.length === 0 ? 0 : page * rowsPerPage + 1
  const endItem = Math.min((page + 1) * rowsPerPage, assets.length)

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

      {/* Pagination - matching original TablePagination */}
      <div className="flex items-center justify-between gap-4 px-4 py-2 border-t bg-background text-[15px] text-muted-foreground">
        <div className="whitespace-nowrap">
          Showing {assets.length} of {assets.length} assets
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
                {[5, 10, 25, 50, 100].map((opt) => (
                  <SelectItem key={opt} value={String(opt)} className="text-[15px]">{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <span className="whitespace-nowrap">{startItem}–{endItem} of {assets.length}</span>

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
