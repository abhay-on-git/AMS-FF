import { useQuery } from '@tanstack/react-query'
import {
  getComplianceGaps,
  getDashboardData,
  getPendingActions,
} from '../services/reportingService'
import type { ComplianceGap, OfficeMetrics, PendingAction } from '../types'

export function useDashboardData(fieldOffice: string) {
  return useQuery<OfficeMetrics>({
    queryKey: ['reports', 'dashboard', fieldOffice],
    queryFn: () => getDashboardData(fieldOffice),
    staleTime: 5 * 60 * 1000,
  })
}

export function usePendingActions(fieldOffice: string) {
  return useQuery<PendingAction[]>({
    queryKey: ['reports', 'pending', fieldOffice],
    queryFn: () => getPendingActions(fieldOffice),
    staleTime: 5 * 60 * 1000,
  })
}

export function useComplianceGaps(fieldOffice: string) {
  return useQuery<ComplianceGap[]>({
    queryKey: ['reports', 'compliance', fieldOffice],
    queryFn: () => getComplianceGaps(fieldOffice),
    staleTime: 5 * 60 * 1000,
  })
}
