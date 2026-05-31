import type { ReportRow, ReportSortOrder } from '../types'

export function getSortedResults(
  data: ReportRow[],
  sortBy: string,
  sortOrder: ReportSortOrder,
): ReportRow[] {
  if (!sortBy || sortBy === 'none') return [...data]

  return [...data].sort((a, b) => {
    const recordA = a as Record<string, string | undefined>
    const recordB = b as Record<string, string | undefined>
    const aVal = (recordA[sortBy] ?? '').toString().toLowerCase()
    const bVal = (recordB[sortBy] ?? '').toString().toLowerCase()
    if (sortOrder === 'asc') return aVal.localeCompare(bVal)
    return bVal.localeCompare(aVal)
  })
}

export function getGroupedResults(
  data: ReportRow[],
  groupBy: string,
): Record<string, ReportRow[]> | null {
  if (groupBy === 'none' || !groupBy) return null

  const groups: Record<string, ReportRow[]> = {}
  data.forEach((item) => {
    const record = item as Record<string, string | undefined>
    const key = record[groupBy] || 'Ungrouped'
    if (!groups[key]) groups[key] = []
    groups[key].push(item)
  })
  return groups
}
