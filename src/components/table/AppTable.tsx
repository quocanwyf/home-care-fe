// components/common/AppTable.tsx
import { useState } from 'react';

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
  onStatusFilterChange?: (status: string) => void;
};

export function AppTable<T>({
  data,
  columns,
  isLoading = false,
  onRowClick,
  pageHeaderTitle = '',
  statusFilter = 'all',
  onStatusFilterChange,
}: AppTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

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

  return (
    <div className="w-full overflow-auto rounded-xl border bg-white pl-8 shadow-sm">
      <div className="px-2">
        <PageHeader pageHeaderTitle={pageHeaderTitle} />
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="font-bold opacity-60">
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
          {/* nếu isloading thì skeleton, 
          còn không thì xét có data hay k?
          nếu có data thì table row, còn k thì k có dữ liệu*/}
          {isLoading ? (
            Array.from({ length: 15 }).map((_, idx) => (
              <TableRow key={idx}>
                {columns.map((_, colIdx) => (
                  <TableCell key={colIdx}>
                    <Skeleton className="h-4 w-full bg-slate-200" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                onClick={() => onRowClick?.(row.original)}
                className="hover:bg-muted"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-muted-foreground py-8 text-center"
              >
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <PageFooter
        className="mb-6"
        status={statusFilter}
        onStatusFilterChange={onStatusFilterChange}
      />
    </div>
  );
}
