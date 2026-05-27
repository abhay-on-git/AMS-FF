import { useState } from 'react';

export function useTableState(defaultPageSize = 10) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [search, setSearch] = useState('');
  return { page, pageSize, search, setPage, setPageSize, setSearch };
}
