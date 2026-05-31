import { apiClient } from '@/services/apiClient'
import { IS_MOCK } from '@/services/mockMode'

export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
}

export async function changePassword(payload: ChangePasswordPayload): Promise<void> {
  if (IS_MOCK) {
    await new Promise<void>((resolve) => setTimeout(resolve, 1200))
    return
  }
  await apiClient.patch('/users/me/password', payload)
}
