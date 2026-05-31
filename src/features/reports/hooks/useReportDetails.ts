import { useQuery } from '@tanstack/react-query'
import { getComplianceGapDetail, getPendingActionDetail } from '../services/reportingService'

export function usePendingActionDetail(actionId: string) {
  return useQuery({
    queryKey: ['reports', 'pending-action', actionId],
    queryFn: () => getPendingActionDetail(actionId),
    staleTime: 60 * 1000,
  })
}

export function useComplianceGapDetail(gapType: string) {
  return useQuery({
    queryKey: ['reports', 'compliance-gap', gapType],
    queryFn: () => getComplianceGapDetail(gapType),
    staleTime: 60 * 1000,
  })
}
