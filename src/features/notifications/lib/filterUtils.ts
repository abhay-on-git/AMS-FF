import type { NotificationDateRange } from '../types'
import { MOCK_REFERENCE_DATE } from '../constants/filterOptions'

export function isWithinDateRange(occurredAt: string, range: NotificationDateRange): boolean {
  const date = new Date(occurredAt)
  if (Number.isNaN(date.getTime())) return true

  const ref = MOCK_REFERENCE_DATE
  const startOfRefDay = new Date(ref)
  startOfRefDay.setUTCHours(0, 0, 0, 0)

  switch (range) {
    case 'today':
      return date >= startOfRefDay && date <= ref
    case '7days': {
      const from = new Date(startOfRefDay)
      from.setUTCDate(from.getUTCDate() - 6)
      return date >= from && date <= ref
    }
    case '30days': {
      const from = new Date(startOfRefDay)
      from.setUTCDate(from.getUTCDate() - 29)
      return date >= from && date <= ref
    }
    case '90days': {
      const from = new Date(startOfRefDay)
      from.setUTCDate(from.getUTCDate() - 89)
      return date >= from && date <= ref
    }
    default:
      return true
  }
}
