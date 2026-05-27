/**
 * ─────────────────────────────────────────────────────────────────────────────
 * CUSTOM HOOKS
 * Reusable React hooks for common functionality
 *
 * WHY: Repeated logic across components leads to:
 *   - Code duplication
 *   - Inconsistent behavior
 *   - Difficult maintenance
 *
 * ENTERPRISE BENEFIT:
 *   - Centralized, tested logic
 *   - Consistent behavior across components
 *   - Easy to update and maintain
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState, useCallback, useMemo } from "react";
import type { PaginationState } from "../types";

/**
 * Pagination hook for table data
 */
export function usePagination(initialPage = 1, initialPageSize = 10) {
  const [pagination, setPagination] = useState<PaginationState>({
    page: initialPage,
    pageSize: initialPageSize,
    total: 0,
    totalPages: 0,
  });

  const setPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  const setPageSize = useCallback((pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      pageSize,
      page: 1,
    }));
  }, []);

  const setTotal = useCallback((total: number) => {
    setPagination((prev) => ({
      ...prev,
      total,
      totalPages: Math.ceil(total / prev.pageSize),
    }));
  }, []);

  const resetPagination = useCallback(() => {
    setPagination({
      page: initialPage,
      pageSize: initialPageSize,
      total: 0,
      totalPages: 0,
    });
  }, [initialPage, initialPageSize]);

  const paginationRange = useMemo(() => {
    const { page, totalPages } = pagination;
    const delta = 2;
    const range: (number | "...")[] = [];
    const rangeWithEllipsis: (number | "...")[] = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= page - delta && i <= page + delta)
      ) {
        range.push(i);
      }
    }

    let prev: number;
    for (const num of range) {
      if (typeof num === "number") {
        if (prev && num - prev !== 1) {
          rangeWithEllipsis.push("...");
        }
        rangeWithEllipsis.push(num);
        prev = num;
      } else {
        rangeWithEllipsis.push(num);
      }
    }

    return rangeWithEllipsis;
  }, [pagination.page, pagination.totalPages]);

  return {
    pagination,
    setPage,
    setPageSize,
    setTotal,
    resetPagination,
    paginationRange,
  };
}

/**
 * Table selection hook for multi-select functionality
 */
export function useSelection<T extends { id: string | number }>() {
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());

  const toggleSelection = useCallback((id: string | number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const selectAll = useCallback((items: T[]) => {
    setSelectedIds(new Set(items.map((item) => item.id)));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const isSelected = useCallback(
    (id: string | number) => selectedIds.has(id),
    [selectedIds]
  );

  const selectedCount = useMemo(
    () => selectedIds.size,
    [selectedIds]
  );

  return {
    selectedIds,
    toggleSelection,
    selectAll,
    clearSelection,
    isSelected,
    selectedCount,
  };
}

/**
 * Toggle state hook with callback support
 */
export function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return { value, toggle, setTrue, setFalse };
}

/**
 * Debounce hook for search inputs
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useState(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Local storage state hook
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}

/**
 * Async state handler for data fetching
 */
export function useAsyncState<T>() {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (asyncFn: () => Promise<T>) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await asyncFn();
        setData(result);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setData(null);
    setIsLoading(false);
    setError(null);
  }, []);

  return { data, setData, isLoading, error, execute, reset };
}