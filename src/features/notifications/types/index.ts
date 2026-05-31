export type NotificationType = 'info' | 'warning' | 'success'

export type NotificationSource =
  | 'System'
  | 'Assets'
  | 'Transfers'
  | 'Inspection'
  | 'Inventory'

export interface AppNotification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: string
  /** ISO date for filtering (YYYY-MM-DD or full ISO) */
  occurredAt: string
  isRead: boolean
  source: NotificationSource
}

export type NotificationStatusFilter = 'all' | 'unread' | 'read'

export type NotificationDateRange = 'today' | '7days' | '30days' | '90days'

export interface NotificationFilters {
  search?: string
  status?: NotificationStatusFilter
  source?: string
  dateRange?: NotificationDateRange
}
