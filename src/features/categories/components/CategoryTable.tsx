import { useState, useMemo } from 'react'
import { MoreHorizontal, Search, Columns3, FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ConfirmDialog, TablePagination } from '@/components/shared'
import { useTablePagination } from '@/hooks/useTablePagination'
import { useDeleteCategory } from '../hooks/useCategoryMutations'
import type { Category } from '../types'

interface ColConfig {
  key: keyof Category | 'actions'
  label: string
  visible: boolean
}

const DEFAULT_COLUMNS: ColConfig[] = [
  { key: 'categoryName', label: 'Category Name', visible: true },
  { key: 'categoryCode', label: 'Code',          visible: false },
  { key: 'status',         label: 'Status',        visible: true },
  { key: 'description',    label: 'Description',   visible: true },
  { key: 'createdDate',    label: 'Created Date',  visible: true },
]

const STATUS_COLORS: Record<string, string> = {
  active:   'border-green-500 text-green-700 bg-green-50 dark:bg-green-950 dark:text-green-400',
  inactive: 'border-gray-400  text-gray-600  bg-gray-50  dark:bg-gray-900  dark:text-gray-400',
}

interface CategoryTableProps {
  data:      Category[]
  isLoading: boolean
  onEdit:    (category: Category) => void
}

export function CategoryTable({ data, isLoading, onEdit }: CategoryTableProps) {
  const [search,       setSearch]       = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [columns,      setColumns]      = useState<ColConfig[]>(DEFAULT_COLUMNS)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)

  const deleteMutation = useDeleteCategory()

  const toggleColumn = (key: string) =>
    setColumns((prev) => prev.map((c) => (c.key === key ? { ...c, visible: !c.visible } : c)))

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return data.filter((c) => {
      const matchSearch =
        !q ||
        c.categoryName.toLowerCase().includes(q) ||
        c.categoryCode.toLowerCase().includes(q) ||
        (c.description?.toLowerCase().includes(q) ?? false)
      const matchStatus = statusFilter === 'all' || c.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [data, search, statusFilter])

  const visibleCols = columns.filter((c) => c.visible)

  const { page, rowsPerPage, setPage, setRowsPerPage, pageData } = useTablePagination(
    filtered,
    [search, statusFilter],
  )

  if (isLoading) {
    return <div className="p-6 text-muted-foreground text-[15px]">Loading categories…</div>
  }

  return (
    <div className="space-y-0">
      <div className="rounded-lg border bg-background">
        <div className="flex flex-col sm:flex-row gap-3 px-4 py-3 border-b">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search categories…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-[15px] placeholder:text-muted-foreground/60"
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36 h-9 text-[15px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-[15px]">All Status</SelectItem>
                <SelectItem value="active" className="text-[15px]">Active</SelectItem>
                <SelectItem value="inactive" className="text-[15px]">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 text-[15px] gap-1.5 px-3">
                  <Columns3 className="w-4 h-4" /> Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {columns.map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.key}
                    checked={col.visible}
                    onCheckedChange={() => toggleColumn(col.key)}
                    className="text-[15px]"
                  >
                    {col.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                {visibleCols.map((col) => (
                  <TableHead
                    key={col.key}
                    className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    {col.label}
                  </TableHead>
                ))}
                <TableHead className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground text-right pr-4">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={visibleCols.length + 1}
                    className="text-center py-10 text-muted-foreground text-[15px]"
                  >
                    No categories found
                  </TableCell>
                </TableRow>
              ) : (
                pageData.map((category) => (
                  <TableRow key={category.id} className="hover:bg-muted/20">
                    {visibleCols.map((col) => (
                      <TableCell key={col.key}>
                        {col.key === 'categoryName' && (
                          <div className="flex items-center gap-2.5">
                            <FolderOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span className="text-[15px] font-medium">{category.categoryName}</span>
                          </div>
                        )}
                        {col.key === 'categoryCode' && (
                          <span className="text-[15px] font-mono">{category.categoryCode}</span>
                        )}
                        {col.key === 'description' && (
                          <span className="text-[15px] text-muted-foreground">
                            {category.description || '—'}
                          </span>
                        )}
                        {col.key === 'createdDate' && (
                          <span className="text-[15px] text-muted-foreground">{category.createdDate}</span>
                        )}
                        {col.key === 'status' && (
                          <Badge variant="outline" className={`text-[12px] ${STATUS_COLORS[category.status] ?? ''}`}>
                            {category.status.charAt(0).toUpperCase() + category.status.slice(1)}
                          </Badge>
                        )}
                      </TableCell>
                    ))}
                    <TableCell className="text-right pr-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem className="text-[15px]" onClick={() => onEdit(category)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-[15px] text-destructive focus:text-destructive"
                            onClick={() => setDeleteTarget(category)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <TablePagination
          totalItems={filtered.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={setPage}
          onRowsPerPageChange={setRowsPerPage}
          totalUnfilteredItems={data.length}
          itemLabel="categories"
        />
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete Category"
        description={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.categoryName}" (${deleteTarget.categoryCode})? Assets assigned to this category may need to be reassigned. This action cannot be undone.`
            : undefined
        }
        confirmLabel="Delete Category"
        variant="destructive"
        loading={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteTarget) {
            deleteMutation.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })
          }
        }}
      />
    </div>
  )
}
