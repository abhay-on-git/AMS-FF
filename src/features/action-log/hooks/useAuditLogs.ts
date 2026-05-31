import { useQuery } from '@tanstack/react-query'
import { getAuditLogs, type AuditLogFilters } from '../services/actionLogService'

export function useAuditLogs(filters?: AuditLogFilters) {
  return useQuery({
    queryKey: ['audit-logs', filters],
    queryFn: () => getAuditLogs(filters),
  })
}
