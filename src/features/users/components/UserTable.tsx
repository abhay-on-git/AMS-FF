import { useState, useMemo } from 'react'
import { MoreHorizontal, Search, Columns3, Download, Users, UserCheck, UserX, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ConfirmDialog, TablePagination } from '@/components/shared'
import { useTablePagination } from '@/hooks/useTablePagination'
import { useDeleteUser, useToggleUserStatus } from '../hooks/useUserMutations'
import { roleOptions, fieldOfficeOptions } from '../constants/userOptions'
import type { UserData } from '../types'

interface ColConfig { key: string; label: string; visible: boolean }

const DEFAULT_COLUMNS: ColConfig[] = [
  { key: 'name',        label: 'User',         visible: true  },
  { key: 'email',       label: 'Email',        visible: true  },
  { key: 'role',        label: 'Role',         visible: true  },
  { key: 'fieldOffice', label: 'Field Office', visible: true  },
  { key: 'status',      label: 'Status',       visible: true  },
  { key: 'createdDate', label: 'Created',      visible: true  },
  { key: 'mobile',      label: 'Mobile',       visible: false },
  { key: 'lastLogin',   label: 'Last Login',   visible: false },
]

const STATUS_COLORS: Record<string, string> = {
  active:   'border-green-500 text-green-700 bg-green-50 dark:bg-green-950 dark:text-green-400',
  inactive: 'border-gray-400  text-gray-600  bg-gray-50  dark:bg-gray-900  dark:text-gray-400',
  locked:   'border-red-400   text-red-600   bg-red-50   dark:bg-red-950   dark:text-red-400',
}

const STAT_CARDS = [
  { key: 'total',    label: 'Total Users',     Icon: Users     },
  { key: 'active',   label: 'Active Users',    Icon: UserCheck },
  { key: 'inactive', label: 'Inactive Users',  Icon: UserX     },
  { key: 'locked',   label: 'Locked Accounts', Icon: Lock      },
] as const

interface UserTableProps {
  data:            UserData[]
  isLoading:       boolean
  onViewDetail:    (user: UserData) => void
  onEdit:          (user: UserData) => void
  onResetPassword: (user: UserData) => void
}

export function UserTable({
  data, isLoading,
  onViewDetail, onEdit, onResetPassword,
}: UserTableProps) {
  const [search,       setSearch]       = useState('')
  const [roleFilter,   setRoleFilter]   = useState('all')
  const [officeFilter, setOfficeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [columns,      setColumns]      = useState<ColConfig[]>(DEFAULT_COLUMNS)
  const [deleteTarget, setDeleteTarget] = useState<UserData | null>(null)

  const deleteMutation       = useDeleteUser()
  const toggleStatusMutation = useToggleUserStatus()

  const toggleColumn = (key: string) =>
    setColumns((prev) => prev.map((c) => c.key === key ? { ...c, visible: !c.visible } : c))

  const stats = useMemo(() => ({
    total:    data.length,
    active:   data.filter((u) => u.status === 'active').length,
    inactive: data.filter((u) => u.status === 'inactive').length,
    locked:   data.filter((u) => u.status === 'locked').length,
  }), [data])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return data.filter((u) => {
      const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      const matchRole   = roleFilter   === 'all' || u.role        === roleFilter
      const matchOffice = officeFilter === 'all' || u.fieldOffice === officeFilter
      const matchStatus = statusFilter === 'all' || u.status      === statusFilter
      return matchSearch && matchRole && matchOffice && matchStatus
    })
  }, [data, search, roleFilter, officeFilter, statusFilter])

  const visibleCols = columns.filter((c) => c.visible)

  const { page, rowsPerPage, setPage, setRowsPerPage, pageData } = useTablePagination(
    filtered,
    [search, roleFilter, officeFilter, statusFilter],
  )

  if (isLoading) return <div className="p-6 text-muted-foreground text-15">Loading users…</div>

  return (
    <div className="space-y-5">
      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {STAT_CARDS.map(({ key, label, Icon }) => (
          <div key={key} className="flex items-center justify-between rounded-lg border bg-background p-4">
            <div>
              <p className="text-13 text-muted-foreground">{label}</p>
              <p className="text-2xl font-bold mt-0.5">{stats[key as keyof UserStats]}</p>
            </div>
            <Icon className="w-6 h-6 text-muted-foreground/40" />
          </div>
        ))}
      </div>

      {/* Filter bar + table */}
      <div className="rounded-lg border bg-background">
        <div className="flex flex-col sm:flex-row gap-3 px-4 py-3 border-b">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search name, email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-15 placeholder:text-muted-foreground/60"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="h-9 w-[140px] text-15"><SelectValue placeholder="All Roles" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-15">All Roles</SelectItem>
                {roleOptions.map((o) => <SelectItem key={o.value} value={o.value} className="text-15">{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={officeFilter} onValueChange={setOfficeFilter}>
              <SelectTrigger className="h-9 w-[155px] text-15"><SelectValue placeholder="All Field Offices" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-15">All Field Offices</SelectItem>
                {fieldOfficeOptions.map((o) => <SelectItem key={o.value} value={o.value} className="text-15">{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 w-[120px] text-15"><SelectValue placeholder="All Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all"      className="text-15">All Status</SelectItem>
                <SelectItem value="active"   className="text-15">Active</SelectItem>
                <SelectItem value="inactive" className="text-15">Inactive</SelectItem>
                <SelectItem value="locked"   className="text-15">Locked</SelectItem>
              </SelectContent>
            </Select>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 text-15 gap-1.5 px-3">
                  <Columns3 className="w-4 h-4" /> Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                {columns.map((col) => (
                  <DropdownMenuCheckboxItem key={col.key} checked={col.visible}
                    onCheckedChange={() => toggleColumn(col.key)} className="text-15">
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

        <div className="overflow-auto font-['Manrope']">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                {visibleCols.map((col) => (
                  <TableHead key={col.key} className="text-13 font-semibold uppercase tracking-wide text-muted-foreground">
                    {col.label}
                  </TableHead>
                ))}
                <TableHead className="text-13 font-semibold uppercase tracking-wide text-muted-foreground text-right pr-4">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={visibleCols.length + 1} className="text-center py-10 text-muted-foreground text-15">
                    No users found
                  </TableCell>
                </TableRow>
              ) : pageData.map((u) => (
                <TableRow key={u.id} className="cursor-pointer hover:bg-muted/20" onClick={() => onViewDetail(u)}>
                  {visibleCols.map((col) => (
                    <TableCell key={col.key}>
                      {col.key === 'name' && (
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary shrink-0">
                            {u.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                          </div>
                          <span className="text-15 font-medium">{u.name}</span>
                        </div>
                      )}
                      {col.key === 'email'       && <span className="text-15">{u.email}</span>}
                      {col.key === 'role'        && <span className="text-15">{u.role}</span>}
                      {col.key === 'fieldOffice' && <span className="text-15">{u.fieldOffice}</span>}
                      {col.key === 'mobile'      && <span className="text-15 text-muted-foreground">{u.countryCode} {u.mobile || '—'}</span>}
                      {col.key === 'lastLogin'   && <span className="text-15 text-muted-foreground">{u.lastLogin ?? '—'}</span>}
                      {col.key === 'createdDate' && <span className="text-15 text-muted-foreground">{u.createdDate}</span>}
                      {col.key === 'status' && (
                        <Badge variant="outline" className={`text-[12px] ${STATUS_COLORS[u.status] ?? ''}`}>
                          {u.status.charAt(0).toUpperCase() + u.status.slice(1)}
                        </Badge>
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="text-right pr-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={(e) => e.stopPropagation()}>
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenuItem className="text-15" onClick={() => onViewDetail(u)}>View Detail</DropdownMenuItem>
                        <DropdownMenuItem className="text-15" onClick={() => onEdit(u)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-15" onClick={() => onResetPassword(u)}>Reset Password</DropdownMenuItem>
                        <DropdownMenuItem className="text-15"
                          onClick={() => toggleStatusMutation.mutate({ id: u.id, status: u.status === 'active' ? 'inactive' : 'active' })}>
                          {u.status === 'active' ? 'Deactivate' : 'Activate'}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-15 text-destructive focus:text-destructive"
                          onClick={() => setDeleteTarget(u)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
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
          itemLabel="users"
        />
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete User"
        description={`Permanently delete "${deleteTarget?.name}"? This cannot be undone.`}
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
