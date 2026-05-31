import { apiClient } from '@/services/apiClient'
import { IS_MOCK } from '@/services/mockMode'
import type { User } from '@/store/authSlice'
import type { UpdateProfileFormData, UserProfile } from '../types'

export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

let _profileOverrides: Partial<UserProfile> = {}

function buildMockProfile(authUser: User): UserProfile {
  const parts = authUser.name.trim().split(/\s+/)
  const firstName = _profileOverrides.firstName ?? parts[0] ?? 'Admin'
  const lastName = _profileOverrides.lastName ?? (parts.slice(1).join(' ') || 'User')

  return {
    id: authUser.id,
    firstName,
    lastName,
    email: _profileOverrides.email ?? authUser.email,
    phoneCountryCode: _profileOverrides.phoneCountryCode ?? '+962',
    phone: _profileOverrides.phone ?? '123-4567',
    fieldOffice: _profileOverrides.fieldOffice ?? 'Amman Headquarters',
    department: _profileOverrides.department ?? 'IT & Asset Management',
  }
}

export async function getProfile(authUser: User): Promise<UserProfile> {
  if (IS_MOCK) {
    await delay(400)
    return buildMockProfile(authUser)
  }
  const { data } = await apiClient.get<UserProfile>('/users/me')
  return data
}

export async function updateProfile(
  authUser: User,
  formData: UpdateProfileFormData,
): Promise<UserProfile> {
  if (IS_MOCK) {
    await delay(1000)
    _profileOverrides = { ..._profileOverrides, ...formData }
    return buildMockProfile(authUser)
  }
  const { data } = await apiClient.patch<UserProfile>('/users/me', formData)
  return data
}

export async function changePassword(payload: ChangePasswordPayload): Promise<void> {
  if (IS_MOCK) {
    await delay(1200)
    return
  }
  await apiClient.patch('/users/me/password', payload)
}
