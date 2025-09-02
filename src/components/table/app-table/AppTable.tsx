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
import { usePermission } from '@/hooks/common/usePermission';
import type { PermissionModule } from '@/types/auth';
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
  onPaginationChange?: (pagination: PaginationState) => void;
  onResetFilters?: () => void;
  totalData?: number;
  isHeader?: boolean;
  isFooter?: boolean;
  heightRow?: string;
  permissionModule?: PermissionModule;
  customAddAction?: () => void;
  showAddButton?: boolean;
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
  onPaginationChange,
  onResetFilters,
  totalData,
  isHeader = true,
  isFooter = true,
  heightRow = 'h-14',
  permissionModule,
  customAddAction,
  showAddButton = true,
}: AppTableProps<T>) {
  const { canCreate } = usePermission();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSize,
  });

  useEffect(() => {
    onPaginationChange?.(pagination);
  }, [pagination, onPaginationChange]);

  // Cập nhật pagination khi pageSize thay đổi từ bên ngoài
  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageSize }));
  }, [pageSize]);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [statusFilter, pageSize]);

  const hasCreatePermission = permissionModule
    ? canCreate(permissionModule)
    : true;
  const shouldShowAddButton = showAddButton && hasCreatePermission;

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination,
    },
    pageCount: Math.ceil((totalData ?? 1) / pagination.pageSize),
    manualPagination: true,
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
    <div className="bg-background flex h-full max-h-screen flex-col overflow-auto rounded-xl border shadow-sm">
      {/* Fixed Header */}
      {isHeader && (
        <div className="bg-background sticky top-0 z-10 rounded-full border-b px-2 pl-8">
          <PageHeader
            pageHeaderTitle={pageHeaderTitle}
            showAddButton={shouldShowAddButton}
            handleClick={customAddAction}
          />
        </div>
      )}

      {/* Scrollable Table Content */}
      <div className="flex-1 overflow-auto pl-8">
        <Table>
          <TableHeader className="bg-background sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="bg-background font-bold opacity-60"
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
                <TableRow key={idx} className={`${heightRow}`}>
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
                      className={`hover:bg-muted ${heightRow}`}
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
                  <TableRow className={`${heightRow}`}>
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
                    <TableRow key={`empty-${idx}`} className={`${heightRow}`}>
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
      {isFooter && (
        <div className="bg-background sticky bottom-0 z-10 rounded-full border-t px-2 pl-8">
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
            totalData={totalData ?? table.getFilteredRowModel().rows.length}
          />
        </div>
      )}
    </div>
  );
}
