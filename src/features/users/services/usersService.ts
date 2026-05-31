// TODO: Replace mock data with real API calls — GET /api/v1/users
import type { UserData, UserStatus, ResetPasswordData } from '../types'

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

// In-memory store so mutations reflect in subsequent reads
let _users: UserData[] = [
  {
    id: '1', name: 'Admin User',  email: 'admin@company.com',
    mobile: '1234567890', countryCode: '+1',
    role: 'Admin',           fieldOffice: 'FO-AMM',
    status: 'active', lastLogin: '2024-01-22 09:30:00', createdDate: '2024-01-01',
  },
  {
    id: '2', name: 'John Doe',    email: 'john.doe@company.com',
    mobile: '9876543210', countryCode: '+66',
    role: 'Manager',         fieldOffice: 'FO-BKK',
    status: 'active', lastLogin: '2024-01-22 08:45:00', createdDate: '2024-01-10',
  },
  {
    id: '3', name: 'Jane Smith',  email: 'jane.smith@company.com',
    mobile: '5551234567', countryCode: '+855',
    role: 'Inventory Staff', fieldOffice: 'FO-PNH',
    status: 'active', lastLogin: '2024-01-21 16:20:00', createdDate: '2024-01-15',
  },
  {
    id: '4', name: 'Bob Wilson',  email: 'bob.wilson@company.com',
    mobile: '412345678',  countryCode: '+61',
    role: 'Inventory Staff', fieldOffice: 'FO-MEL',
    status: 'locked', lastLogin: '2024-01-18 14:10:00', createdDate: '2024-01-20',
  },
  {
    id: '5', name: 'Alice Brown', email: 'alice@company.com',
    mobile: '701234567',  countryCode: '+93',
    role: 'Manager',         fieldOffice: 'FO-AFA',
    status: 'active', lastLogin: '2024-01-22 07:15:00', createdDate: '2024-01-12',
  },
]

export async function getUsers(): Promise<UserData[]> {
  await delay(1000)
  return [..._users]
}

export async function getUserById(id: string): Promise<UserData> {
  await delay(600)
  const user = _users.find((u) => u.id === id)
  if (!user) throw new Error(`User ${id} not found`)
  return { ...user }
}

export async function createUser(
  data: Omit<UserData, 'id' | 'createdDate' | 'lastLogin'>,
): Promise<UserData> {
  await delay(1000)
  // TODO: POST /api/v1/users
  const newUser: UserData = {
    ...data,
    id: `u-${Date.now()}`,
    createdDate: new Date().toISOString().split('T')[0],
  }
  _users = [..._users, newUser]
  return newUser
}

export async function updateUser(
  id: string,
  data: Partial<UserData>,
): Promise<UserData> {
  await delay(1000)
  // TODO: PATCH /api/v1/users/:id
  _users = _users.map((u) => (u.id === id ? { ...u, ...data } : u))
  return _users.find((u) => u.id === id)!
}

export async function deleteUser(id: string): Promise<void> {
  await delay(1000)
  // TODO: DELETE /api/v1/users/:id
  _users = _users.filter((u) => u.id !== id)
}

export async function resetPassword(
  id: string,
  _data: ResetPasswordData,
): Promise<void> {
  await delay(1000)
  // TODO: POST /api/v1/users/:id/reset-password
  // _data carries method, newPassword, forceChange, notifyUser, revokeOtherSessions
}

export async function toggleUserStatus(
  id: string,
  status: UserStatus,
): Promise<UserData> {
  await delay(1000)
  // TODO: PATCH /api/v1/users/:id/status
  _users = _users.map((u) => (u.id === id ? { ...u, status } : u))
  return _users.find((u) => u.id === id)!
}
