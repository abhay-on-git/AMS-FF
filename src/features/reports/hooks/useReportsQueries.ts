import { useQuery } from '@tanstack/react-query'
import {
  getPredefinedReports,
  getSavedQueries,
  getScheduledReports,
  runReport,
} from '../services/reportingService'
import type { PredefinedReport, ReportRow, SavedQuery, ScheduledReport } from '../types'

export function usePredefinedReports() {
  return useQuery<PredefinedReport[]>({
    queryKey: ['reports', 'predefined'],
    queryFn: getPredefinedReports,
    staleTime: 5 * 60 * 1000,
  })
}

export function useScheduledReports() {
  return useQuery<ScheduledReport[]>({
    queryKey: ['reports', 'scheduled'],
    queryFn: getScheduledReports,
    staleTime: 60 * 1000,
  })
}

export function useSavedQueries() {
  return useQuery<SavedQuery[]>({
    queryKey: ['reports', 'saved-queries'],
    queryFn: getSavedQueries,
    staleTime: 60 * 1000,
  })
}

export function useRunReport(
  reportId: string | null,
  fieldOffice: string,
  fields: string[],
  enabled: boolean,
) {
  return useQuery<ReportRow[]>({
    queryKey: ['reports', 'run', reportId, fieldOffice, fields],
    queryFn: () => runReport(reportId!, fieldOffice, fields),
    enabled: enabled && !!reportId,
    staleTime: 0,
  })
}
