import { apiClient } from '@/services/apiClient'
import { IS_MOCK } from '@/services/mockMode'
import { mockAuditLogs } from '../constants/actionLogData'
import type { AuditLog } from '../types'

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

export interface AuditLogFilters {
  search?: string
  entityType?: string
  eventType?: string
  dateFrom?: string
  dateTo?: string
}

function applyFilters(logs: AuditLog[], filters?: AuditLogFilters): AuditLog[] {
  if (!filters) return logs

  let result = [...logs]

  if (filters.search) {
    const q = filters.search.toLowerCase()
    result = result.filter(
      (log) =>
        log.event_type.toLowerCase().includes(q) ||
        log.actor_name.toLowerCase().includes(q) ||
        log.entity_type.toLowerCase().includes(q) ||
        log.entity_id.toLowerCase().includes(q) ||
        (log.justification?.reason ?? '').toLowerCase().includes(q),
    )
  }
  if (filters.entityType && filters.entityType !== 'all') {
    result = result.filter((log) => log.entity_type === filters.entityType)
  }
  if (filters.eventType && filters.eventType !== 'all') {
    result = result.filter((log) => log.event_type === filters.eventType)
  }
  if (filters.dateFrom) {
    result = result.filter((log) => log.timestamp.slice(0, 10) >= filters.dateFrom!)
  }
  if (filters.dateTo) {
    result = result.filter((log) => log.timestamp.slice(0, 10) <= filters.dateTo!)
  }

  return result
}

export async function getAuditLogs(filters?: AuditLogFilters): Promise<AuditLog[]> {
  if (IS_MOCK) {
    await delay(400)
    return applyFilters(mockAuditLogs, filters)
  }
  const { data } = await apiClient.get<AuditLog[]>('/audit-logs', { params: filters })
  return data
}

export async function getAuditLogById(id: string): Promise<AuditLog> {
  if (IS_MOCK) {
    await delay(300)
    const log = mockAuditLogs.find((l) => l.id === id)
    if (!log) throw new Error(`Audit log ${id} not found`)
    return { ...log }
  }
  const { data } = await apiClient.get<AuditLog>(`/audit-logs/${id}`)
  return data
}
