import { apiClient } from '@/services/apiClient'
import { IS_MOCK } from '@/services/mockMode'
import type { UserData, UserStatus, ResetPasswordData } from '../types'

// ─── Filters shape ────────────────────────────────────────────────────────────

export interface UserFilters {
  search?:     string
  role?:       string
  fieldOffice?: string
  status?:     string
  page?:       number
  pageSize?:   number
}

// ─── In-memory mock store ─────────────────────────────────────────────────────

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

let _users: UserData[] = [
  {
    id: '1', name: 'Admin User',  email: 'admin@company.com',
    mobile: '1234567890', countryCode: '+1',
    role: 'Admin',           fieldOffice: 'FO-LV',
    status: 'active', lastLogin: '2024-01-22 09:30:00', createdDate: '2024-01-01',
  },
  {
    id: '2', name: 'John Doe',    email: 'john.doe@company.com',
    mobile: '9876543210', countryCode: '+66',
    role: 'Manager',         fieldOffice: 'FO-BLD',
    status: 'active', lastLogin: '2024-01-22 08:45:00', createdDate: '2024-01-10',
  },
  {
    id: '3', name: 'Jane Smith',  email: 'jane.smith@company.com',
    mobile: '5551234567', countryCode: '+855',
    role: 'Inventory Staff', fieldOffice: 'FO-MTV',
    status: 'active', lastLogin: '2024-01-21 16:20:00', createdDate: '2024-01-15',
  },
  {
    id: '4', name: 'Bob Wilson',  email: 'bob.wilson@company.com',
    mobile: '412345678',  countryCode: '+61',
    role: 'Inventory Staff', fieldOffice: 'FO-AUS',
    status: 'locked', lastLogin: '2024-01-18 14:10:00', createdDate: '2024-01-20',
  },
  {
    id: '5', name: 'Alice Brown', email: 'alice@company.com',
    mobile: '701234567',  countryCode: '+93',
    role: 'Manager',         fieldOffice: 'FO-PHL',
    status: 'active', lastLogin: '2024-01-22 07:15:00', createdDate: '2024-01-12',
  },
]

// ─── getUsers ─────────────────────────────────────────────────────────────────
// GET /users?search=&role=&fieldOffice=&status=&page=&pageSize=

export async function getUsers(filters?: UserFilters): Promise<UserData[]> {
  if (IS_MOCK) {
    await delay(600)
    let result = [..._users]
    if (filters?.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
      )
    }
    if (filters?.role        && filters.role        !== 'all') result = result.filter((u) => u.role        === filters.role)
    if (filters?.fieldOffice && filters.fieldOffice !== 'all') result = result.filter((u) => u.fieldOffice === filters.fieldOffice)
    if (filters?.status      && filters.status      !== 'all') result = result.filter((u) => u.status      === filters.status)
    return result
  }

  const { data } = await apiClient.get<UserData[]>('/users', { params: filters })
  return data
}

// ─── getUserById ──────────────────────────────────────────────────────────────
// GET /users/:id

export async function getUserById(id: string): Promise<UserData> {
  if (IS_MOCK) {
    await delay(400)
    const user = _users.find((u) => u.id === id)
    if (!user) throw new Error(`User ${id} not found`)
    return { ...user }
  }

  const { data } = await apiClient.get<UserData>(`/users/${id}`)
  return data
}

// ─── createUser ───────────────────────────────────────────────────────────────
// POST /users

export async function createUser(
  data: Omit<UserData, 'id' | 'createdDate' | 'lastLogin'>,
): Promise<UserData> {
  if (IS_MOCK) {
    await delay(800)
    const newUser: UserData = {
      ...data,
      id:          `u-${Date.now()}`,
      createdDate: new Date().toISOString().split('T')[0],
    }
    _users = [..._users, newUser]
    return newUser
  }

  const { data: created } = await apiClient.post<UserData>('/users', data)
  return created
}

// ─── updateUser ───────────────────────────────────────────────────────────────
// PATCH /users/:id

export async function updateUser(id: string, data: Partial<UserData>): Promise<UserData> {
  if (IS_MOCK) {
    await delay(800)
    _users = _users.map((u) => (u.id === id ? { ...u, ...data } : u))
    return { ..._users.find((u) => u.id === id)! }
  }

  const { data: updated } = await apiClient.patch<UserData>(`/users/${id}`, data)
  return updated
}

// ─── deleteUser ───────────────────────────────────────────────────────────────
// DELETE /users/:id

export async function deleteUser(id: string): Promise<void> {
  if (IS_MOCK) {
    await delay(600)
    _users = _users.filter((u) => u.id !== id)
    return
  }

  await apiClient.delete(`/users/${id}`)
}

// ─── resetPassword ────────────────────────────────────────────────────────────
// POST /users/:id/reset-password

export async function resetPassword(id: string, data: ResetPasswordData): Promise<void> {
  if (IS_MOCK) {
    await delay(800)
    return
  }

  await apiClient.post(`/users/${id}/reset-password`, data)
}

// ─── toggleUserStatus ─────────────────────────────────────────────────────────
// PATCH /users/:id/status   Body: { status }

export async function toggleUserStatus(id: string, status: UserStatus): Promise<UserData> {
  if (IS_MOCK) {
    await delay(600)
    _users = _users.map((u) => (u.id === id ? { ...u, status } : u))
    return { ..._users.find((u) => u.id === id)! }
  }

  const { data } = await apiClient.patch<UserData>(`/users/${id}/status`, { status })
  return data
}
