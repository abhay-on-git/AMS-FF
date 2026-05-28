import { useCallback, useMemo, useState } from 'react'

interface UseAssetSelectionReturn {
  selectedIds: Set<string>
  isAllSelected: boolean
  selectedCount: number
  toggleRow: (id: string) => void
  selectAll: (pageIds: string[]) => void
  clearSelection: () => void
}

export function useAssetSelection(pageIds: string[]): UseAssetSelectionReturn {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const toggleRow = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const selectAll = useCallback((ids: string[]) => {
    setSelectedIds((prev) => {
      const allSelected = ids.every((id) => prev.has(id))
      if (allSelected) {
        const next = new Set(prev)
        ids.forEach((id) => next.delete(id))
        return next
      }
      const next = new Set(prev)
      ids.forEach((id) => next.add(id))
      return next
    })
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set())
  }, [])

  const isAllSelected = useMemo(
    () => pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id)),
    [pageIds, selectedIds],
  )

  const selectedCount = selectedIds.size

  return { selectedIds, isAllSelected, selectedCount, toggleRow, selectAll, clearSelection }
}
