import { apiClient } from '@/services/apiClient'
import { IS_MOCK } from '@/services/mockMode'
import { MOCK_NOTIFICATIONS } from '../constants/notificationsData'
import type { AppNotification } from '../types'

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

let _notifications: AppNotification[] = MOCK_NOTIFICATIONS.map((n) => ({ ...n }))

export async function getNotifications(): Promise<AppNotification[]> {
  if (IS_MOCK) {
    await delay(400)
    return _notifications.map((n) => ({ ...n }))
  }
  const { data } = await apiClient.get<AppNotification[]>('/notifications')
  return data
}

export async function markNotificationRead(id: string): Promise<void> {
  if (IS_MOCK) {
    await delay(300)
    _notifications = _notifications.map((n) =>
      n.id === id ? { ...n, isRead: true } : n,
    )
    return
  }
  await apiClient.patch(`/notifications/${id}/read`)
}

export async function markAllNotificationsRead(): Promise<void> {
  if (IS_MOCK) {
    await delay(400)
    _notifications = _notifications.map((n) => ({ ...n, isRead: true }))
    return
  }
  await apiClient.patch('/notifications/read-all')
}
