import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TablePaginationProps {
  totalItems: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  rowsPerPageOptions?: number[];
  totalUnfilteredItems?: number;
  itemLabel?: string;
}

export function TablePagination({
  totalItems,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [5, 10, 25, 50, 100],
  totalUnfilteredItems,
  itemLabel = "items",
}: TablePaginationProps) {
  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / rowsPerPage),
  );
  const startItem =
    totalItems === 0 ? 0 : page * rowsPerPage + 1;
  const endItem = Math.min(
    (page + 1) * rowsPerPage,
    totalItems,
  );

  const handleFirstPage = () => onPageChange(0);
  const handlePrevPage = () =>
    onPageChange(Math.max(0, page - 1));
  const handleNextPage = () =>
    onPageChange(Math.min(totalPages - 1, page + 1));
  const handleLastPage = () => onPageChange(totalPages - 1);

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-2 border-t bg-background text-[15px] text-muted-foreground">
      {/* Record Count - Left Side */}
      {totalUnfilteredItems !== undefined && (
        <div className="whitespace-nowrap">
          Showing {totalItems} of {totalUnfilteredItems}{" "}
          {itemLabel}
        </div>
      )}

      {/* Right Side Controls */}
      <div className="flex items-center gap-4 ml-auto ">
        <div className="flex items-center gap-2">
          <span className="whitespace-nowrap">
            Rows per page:
          </span>
          <Select
            value={String(rowsPerPage)}
            onValueChange={(val) => {
              onRowsPerPageChange(Number(val));
              onPageChange(0);
            }}
          >
            <SelectTrigger className="h-8 w-[70px] border-0 bg-white shadow-none focus:ring-0 px-2 text-[15px]">
              <SelectValue className="text-[15px]" />
            </SelectTrigger>
            <SelectContent>
              {rowsPerPageOptions.map((opt) => (
                <SelectItem
                  key={opt}
                  value={String(opt)}
                  className="text-[15px]"
                >
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <span className="whitespace-nowrap">
          {startItem}–{endItem} of {totalItems}
        </span>

        <div className="flex items-center gap-0.5">
          <button
            onClick={handleFirstPage}
            disabled={page === 0}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full disabled:opacity-30 disabled:pointer-events-none transition-colors"
            aria-label="First page"
          >
            <ChevronsLeft className="w-8 h-8" />
          </button>
          <button
            onClick={handlePrevPage}
            disabled={page === 0}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full disabled:opacity-30 disabled:pointer-events-none transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={handleNextPage}
            disabled={page >= totalPages - 1}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full disabled:opacity-30 disabled:pointer-events-none transition-colors"
            aria-label="Next page"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
          <button
            onClick={handleLastPage}
            disabled={page >= totalPages - 1}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full disabled:opacity-30 disabled:pointer-events-none transition-colors"
            aria-label="Last page"
          >
            <ChevronsRight className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
}

/** Helper: slice data for current page */
export function paginateData<T>(
  data: T[],
  page: number,
  rowsPerPage: number,
): T[] {
  return data.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage,
  );
}
