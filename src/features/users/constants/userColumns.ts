import React from 'react'
import type { ColumnConfig } from '@/types'
import type { UserData } from '../types'
import { StatusBadge } from '@/components/shared'
import { formatDate } from '@/lib/utils/dateFormatter'

export const defaultUserColumns: ColumnConfig<UserData>[] = [
  {
    key: 'name',
    label: 'User',
    visible: true,
    sortable: true,
    // Avatar + name rendered by UserTable via custom cell logic
  },
  {
    key: 'email',
    label: 'Email',
    visible: true,
    sortable: true,
  },
  {
    key: 'role',
    label: 'Role',
    visible: true,
    sortable: true,
  },
  {
    key: 'fieldOffice',
    label: 'Field Office',
    visible: true,
    sortable: true,
  },
  {
    key: 'status',
    label: 'Status',
    visible: true,
    sortable: true,
    render: (row) =>
      React.createElement(StatusBadge, { status: row.status }),
  },
  {
    key: 'createdDate',
    label: 'Created',
    visible: true,
    sortable: true,
    render: (row) => formatDate(row.createdDate),
  },
  {
    key: 'mobile',
    label: 'Mobile',
    visible: false,
    sortable: false,
  },
  {
    key: 'lastLogin',
    label: 'Last Login',
    visible: false,
    sortable: true,
    render: (row) => (row.lastLogin ? formatDate(row.lastLogin) : '—'),
  },
]
