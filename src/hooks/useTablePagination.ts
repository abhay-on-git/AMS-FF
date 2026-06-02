import { useEffect, useMemo, useState } from 'react'
import { paginateData } from '@/components/shared/TablePagination'

export function useTablePagination<T>(
  data: T[],
  resetDeps: unknown[] = [],
  defaultRowsPerPage = 10,
) {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage)

  useEffect(() => {
    setPage(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset when filters change
  }, [data.length, ...resetDeps])

  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(data.length / rowsPerPage) - 1)
    if (page > maxPage) setPage(maxPage)
  }, [data.length, rowsPerPage, page])

  const pageData = useMemo(
    () => paginateData(data, page, rowsPerPage),
    [data, page, rowsPerPage],
  )

  return {
    page,
    rowsPerPage,
    setPage,
    setRowsPerPage,
    pageData,
  }
}
