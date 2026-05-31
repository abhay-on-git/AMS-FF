import { apiClient } from '@/services/apiClient'
import { IS_MOCK } from '@/services/mockMode'
import type {
  ComplianceGap,
  CreateSchedulePayload,
  OfficeMetrics,
  PendingAction,
  PredefinedReport,
  ReportRow,
  SavedQuery,
  ScheduledReport,
  UpdateSchedulePayload,
} from '../types'
import {
  MOCK_REPORT_DATA,
  PREDEFINED_REPORTS,
  SEED_SAVED_QUERIES,
  SEED_SCHEDULED_REPORTS,
  filterPendingActions,
  resolveComplianceGaps,
  resolveOfficeMetrics,
} from '../constants/reportingData'

let scheduledReportsCache = [...SEED_SCHEDULED_REPORTS]
let savedQueriesCache = [...SEED_SAVED_QUERIES]

export async function getDashboardData(fieldOffice: string): Promise<OfficeMetrics> {
  if (IS_MOCK) {
    return Promise.resolve(resolveOfficeMetrics(fieldOffice))
  }
  const { data } = await apiClient.get<OfficeMetrics>('/reports/dashboard', {
    params: { fieldOffice },
  })
  return data
}

export async function getPendingActions(fieldOffice: string): Promise<PendingAction[]> {
  if (IS_MOCK) {
    return Promise.resolve(filterPendingActions(fieldOffice))
  }
  const { data } = await apiClient.get<PendingAction[]>('/reports/pending-actions', {
    params: { fieldOffice },
  })
  return data
}

export async function getComplianceGaps(fieldOffice: string): Promise<ComplianceGap[]> {
  if (IS_MOCK) {
    return Promise.resolve(resolveComplianceGaps(fieldOffice))
  }
  const { data } = await apiClient.get<ComplianceGap[]>('/reports/compliance-gaps', {
    params: { fieldOffice },
  })
  return data
}

export async function getPredefinedReports(): Promise<PredefinedReport[]> {
  if (IS_MOCK) {
    return Promise.resolve(
      PREDEFINED_REPORTS.map((report) => ({ ...report, icon: null })) as PredefinedReport[],
    )
  }
  const { data } = await apiClient.get<PredefinedReport[]>('/reports/predefined')
  return data
}

export async function runReport(
  reportId: string,
  fieldOffice: string,
  fields: string[],
): Promise<ReportRow[]> {
  if (IS_MOCK) {
    void reportId
    void fieldOffice
    void fields
    return Promise.resolve(MOCK_REPORT_DATA)
  }
  const { data } = await apiClient.post<ReportRow[]>('/reports/run', {
    reportId,
    fieldOffice,
    fields,
  })
  return data
}

export async function getScheduledReports(): Promise<ScheduledReport[]> {
  if (IS_MOCK) {
    return Promise.resolve([...scheduledReportsCache])
  }
  const { data } = await apiClient.get<ScheduledReport[]>('/reports/scheduled')
  return data
}

export async function createSchedule(data: CreateSchedulePayload): Promise<ScheduledReport> {
  if (IS_MOCK) {
    const created: ScheduledReport = {
      id: `SR-${String(scheduledReportsCache.length + 1).padStart(3, '0')}`,
      name: data.name,
      reportType: data.reportType,
      frequency: data.frequency,
      recipients: data.recipients,
      format: data.format,
      nextRun: new Date().toISOString().split('T')[0],
      enabled: true,
      createdBy: 'admin@company.com',
    }
    scheduledReportsCache = [created, ...scheduledReportsCache]
    return Promise.resolve(created)
  }
  const { data: created } = await apiClient.post<ScheduledReport>('/reports/scheduled', data)
  return created
}

export async function updateSchedule(
  id: string,
  data: UpdateSchedulePayload,
): Promise<ScheduledReport> {
  if (IS_MOCK) {
    const index = scheduledReportsCache.findIndex((schedule) => schedule.id === id)
    if (index === -1) throw new Error(`Schedule ${id} not found`)
    const updated = { ...scheduledReportsCache[index], ...data }
    scheduledReportsCache = scheduledReportsCache.map((schedule) =>
      schedule.id === id ? updated : schedule,
    )
    return Promise.resolve(updated)
  }
  const { data: updated } = await apiClient.put<ScheduledReport>(`/reports/scheduled/${id}`, data)
  return updated
}

export async function deleteSchedule(id: string): Promise<void> {
  if (IS_MOCK) {
    scheduledReportsCache = scheduledReportsCache.filter((schedule) => schedule.id !== id)
    return Promise.resolve()
  }
  await apiClient.delete(`/reports/scheduled/${id}`)
}

export async function getSavedQueries(): Promise<SavedQuery[]> {
  if (IS_MOCK) return Promise.resolve([...savedQueriesCache])
  const { data } = await apiClient.get<SavedQuery[]>('/reports/saved-queries')
  return data
}

export async function saveSavedQuery(query: Omit<SavedQuery, 'id' | 'createdAt'>): Promise<SavedQuery> {
  if (IS_MOCK) {
    const created: SavedQuery = {
      ...query,
      id: `SQ-${String(savedQueriesCache.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString().split('T')[0],
    }
    savedQueriesCache = [created, ...savedQueriesCache]
    return Promise.resolve(created)
  }
  const { data } = await apiClient.post<SavedQuery>('/reports/saved-queries', query)
  return data
}

export async function deleteSavedQuery(id: string): Promise<void> {
  if (IS_MOCK) {
    savedQueriesCache = savedQueriesCache.filter((q) => q.id !== id)
    return Promise.resolve()
  }
  await apiClient.delete(`/reports/saved-queries/${id}`)
}

export function exportReportMock(format: 'excel' | 'pdf' | 'csv'): void {
  void format
}
