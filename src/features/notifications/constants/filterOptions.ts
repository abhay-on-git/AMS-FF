import type { NotificationDateRange, NotificationSource } from '../types'

export const NOTIFICATION_SOURCES: NotificationSource[] = [
  'System',
  'Assets',
  'Transfers',
  'Inspection',
  'Inventory',
]

export const DATE_RANGE_OPTIONS: { value: NotificationDateRange; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: '7days', label: 'Last 7 Days' },
  { value: '30days', label: 'Last 30 Days' },
  { value: '90days', label: 'Last 90 Days' },
]

/** Reference date aligned with mock notification timestamps */
export const MOCK_REFERENCE_DATE = new Date('2024-01-22T14:30:00Z')
