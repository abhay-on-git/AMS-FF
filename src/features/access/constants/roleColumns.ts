import type { DataTableColumn } from '@/components/shared/DataTable'
import type { Role } from '../types'

export const defaultRoleColumns: DataTableColumn<Role>[] = [
  {
    key:    'name',
    header: 'Role Name',
    render: (r) => (
      <div>
        <p className="text-[13px] font-medium font-['Manrope']">{r.name}</p>
        <p className="text-[11px] text-muted-foreground capitalize">{r.type} · {r.category}</p>
      </div>
    ),
  },
  {
    key:    'description',
    header: 'Description',
    render: (r) => (
      <span className="text-[12px] text-muted-foreground line-clamp-2">
        {r.description}
      </span>
    ),
  },
  {
    key:    'userCount',
    header: 'Users',
    render: (r) => (
      <span className="text-[13px] font-['Manrope'] tabular-nums">{r.userCount}</span>
    ),
  },
]
