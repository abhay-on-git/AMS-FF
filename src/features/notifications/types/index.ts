export type NotificationType = 'info' | 'warning' | 'success'

export interface AppNotification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: string
  isRead: boolean
  source: string
}
