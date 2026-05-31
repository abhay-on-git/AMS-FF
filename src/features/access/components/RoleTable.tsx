import { useState, useMemo } from 'react'
import { MoreHorizontal, Search, Columns3, Download, Shield, Lock, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ConfirmDialog } from '@/components/shared'
import { useDeleteRole, useCloneRole } from '../hooks/useRoleMutations'
import type { Role } from '../types'

interface ColConfig { key: string; label: string; visible: boolean }

const DEFAULT_COLUMNS: ColConfig[] = [
  { key: 'name',        label: 'Role Name',    visible: true  },
  { key: 'description', label: 'Description',  visible: true  },
  { key: 'userCount',   label: 'Users',        visible: true  },
  { key: 'category',    label: 'Category',     visible: false },
  { key: 'lastModified',label: 'Last Modified',visible: false },
]

interface RoleTableProps {
  data:         Role[]
  isLoading:    boolean
  onViewDetail: (role: Role) => void
  onEdit:       (role: Role) => void
}

export function RoleTable({ data, isLoading, onViewDetail, onEdit }: RoleTableProps) {
  const [search,       setSearch]       = useState('')
  const [columns,      setColumns]      = useState<ColConfig[]>(DEFAULT_COLUMNS)
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null)

  const deleteMutation = useDeleteRole()
  const cloneMutation  = useCloneRole()

  const toggleColumn = (key: string) =>
    setColumns((prev) => prev.map((c) => c.key === key ? { ...c, visible: !c.visible } : c))

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return data.filter((r) => !q || r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q))
  }, [data, search])

  const visibleCols = columns.filter((c) => c.visible)

  if (isLoading) return <div className="p-6 text-muted-foreground text-[15px]">Loading roles…</div>

  return (
    <div className="space-y-0">
      <div className="rounded-lg border bg-background">
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 px-4 py-3 border-b">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search roles…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-[15px] placeholder:text-muted-foreground/60"
            />
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 text-[15px] gap-1.5 px-3">
                  <Columns3 className="w-4 h-4" /> Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                {columns.map((col) => (
                  <DropdownMenuCheckboxItem key={col.key} checked={col.visible}
                    onCheckedChange={() => toggleColumn(col.key)} className="text-[15px]">
                    {col.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm" className="h-9 w-9 p-0">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-auto font-['Manrope']">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                {visibleCols.map((col) => (
                  <TableHead key={col.key} className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">
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
                  <TableCell colSpan={visibleCols.length + 1} className="text-center py-10 text-muted-foreground text-[15px]">
                    No roles found
                  </TableCell>
                </TableRow>
              ) : filtered.map((r) => (
                <TableRow key={r.id} className="cursor-pointer hover:bg-muted/20" onClick={() => onViewDetail(r)}>
                  {visibleCols.map((col) => (
                    <TableCell key={col.key}>
                      {col.key === 'name' && (
                        <div className="flex items-center gap-2.5">
                          <Shield className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="text-[15px] font-medium">{r.name}</span>
                        </div>
                      )}
                      {col.key === 'description' && (
                        <span className="text-[15px] text-muted-foreground line-clamp-1 max-w-sm">{r.description}</span>
                      )}
                      {col.key === 'userCount' && (
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-[15px] tabular-nums">{r.userCount}</span>
                        </div>
                      )}
                      {col.key === 'category' && (
                        <Badge variant="outline" className="text-[12px] capitalize">{r.category}</Badge>
                      )}
                      {col.key === 'lastModified' && (
                        <span className="text-[15px] text-muted-foreground">{r.lastModified}</span>
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="text-right pr-2" onClick={(e) => e.stopPropagation()}>
                    {r.type === 'system' ? (
                      <div className="flex justify-end pr-1">
                        <Lock className="w-4 h-4 text-muted-foreground/40" />
                      </div>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem className="text-[15px]" onClick={() => onViewDetail(r)}>View</DropdownMenuItem>
                          <DropdownMenuItem className="text-[15px]" onClick={() => onEdit(r)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-[15px]" onClick={() => cloneMutation.mutate(r.id)}>Clone</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-[15px] text-destructive focus:text-destructive"
                            onClick={() => setDeleteTarget(r)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete Role"
        description={`Permanently delete "${deleteTarget?.name}"? Users assigned this role will lose access.`}
        confirmLabel="Delete"
        variant="destructive"
        loading={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteTarget) deleteMutation.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })
        }}
      />
    </div>
  )
}
