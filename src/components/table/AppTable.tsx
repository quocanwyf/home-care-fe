// components/common/AppTable.tsx
import { useEffect, useState } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type {
  ColumnDef,
  PaginationState,
  SortingState,
} from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import PageFooter from './PageFooter';
import PageHeader from './PageHeader';

type AppTableProps<T, TValue = unknown> = {
  data: T[];
  columns: ColumnDef<T, TValue>[];
  isLoading?: boolean;
  onRowClick?: (row: T) => void;
  pageHeaderTitle?: string;
  statusFilter?: string;
  listStatusFilter?: string[];
  onStatusFilterChange?: (status: string) => void;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  onResetFilters?: () => void;
};

export function AppTable<T>({
  data,
  columns,
  isLoading = false,
  onRowClick,
  pageHeaderTitle = '',
  statusFilter = 'all',
  listStatusFilter = [],
  onStatusFilterChange,
  pageSize = 10,
  onPageSizeChange,
  onResetFilters,
}: AppTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSize,
  });

  // Cập nhật pagination khi pageSize thay đổi từ bên ngoài
  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageSize }));
  }, [pageSize]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
  });

  // Tính toán số rows cần thiết để fill đủ chiều cao
  const actualRows = table.getRowModel().rows;
  const emptyRowsCount = Math.max(0, pageSize - actualRows.length);

  return (
    <div className="flex h-full max-h-screen flex-col overflow-hidden rounded-xl border bg-white shadow-sm">
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 rounded-full border-b bg-white px-2 pl-8">
        <PageHeader pageHeaderTitle={pageHeaderTitle} />
      </div>

      {/* Scrollable Table Content */}
      <div className="flex-1 overflow-auto pl-8">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="bg-white font-bold opacity-60"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {/* Loading skeleton rows */}
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, idx) => (
                <TableRow key={idx} className="h-14">
                  {columns.map((_, colIdx) => (
                    <TableCell key={colIdx}>
                      <Skeleton className="h-4 w-full bg-slate-200" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <>
                {/* Actual data rows */}
                {actualRows.length > 0 ? (
                  actualRows.map((row) => (
                    <TableRow
                      key={row.id}
                      onClick={() => onRowClick?.(row.original)}
                      className="hover:bg-muted h-14"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  /* No data message - chiếm 1 row */
                  <TableRow className="h-14">
                    <TableCell
                      colSpan={columns.length}
                      className="text-muted-foreground py-8 text-center"
                    >
                      No data available
                    </TableCell>
                  </TableRow>
                )}

                {/* Empty rows để fill đủ chiều cao */}
                {actualRows.length > 0 &&
                  emptyRowsCount > 0 &&
                  Array.from({ length: emptyRowsCount }).map((_, idx) => (
                    <TableRow key={`empty-${idx}`} className="h-14">
                      {columns.map((_, colIdx) => (
                        <TableCell key={colIdx}>&nbsp;</TableCell>
                      ))}
                    </TableRow>
                  ))}
              </>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Fixed Footer */}
      <div className="sticky bottom-0 z-10 rounded-full border-t bg-white px-2 pl-8">
        <PageFooter
          status={statusFilter}
          onStatusFilterChange={onStatusFilterChange}
          listStatusFilter={listStatusFilter}
          pageSize={pageSize}
          onPageSizeChange={onPageSizeChange}
          onResetFilters={onResetFilters}
          pageIndex={pagination.pageIndex}
          pageCount={table.getPageCount()}
          onPageChange={(pageIndex) => {
            setPagination((prev) => ({ ...prev, pageIndex }));
            table.setPageIndex(pageIndex);
          }}
          totalData={data.length}
        />
      </div>
    </div>
  );
}
