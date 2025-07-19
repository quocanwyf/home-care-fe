import { useState } from 'react';

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';

import Pagination from './AppPagination';
import TableHeader from './TableHeader';

interface DataTableProps<TData, TValue> {
  title?: string;
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  onAdd?: () => void;
  addButtonText?: string;
  initialPageSize?: number;
  showItemsPerPage?: boolean;
  className?: string;
}

const DataTable = <TData, TValue>({
  title = '',
  data,
  columns,
  onAdd,
  addButtonText,
  initialPageSize = 10,
  showItemsPerPage = true,
  className = '',
}: DataTableProps<TData, TValue>) => {
  const [pageSize, setPageSize] = useState(initialPageSize);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination: {
        pageIndex: 0,
        pageSize,
      },
    },
  });

  return (
    <div
      className={`overflow-hidden rounded-lg rounded-xl border border-gray-200 shadow-md ${className}`}
    >
      {title && (
        <TableHeader
          title={title}
          onAdd={onAdd}
          addButtonText={addButtonText}
        />
      )}

      <div className="relative overflow-x-auto">
        <table className="w-full min-w-full divide-y divide-gray-200 text-left">
          <thead className="bg-overlay-slider text-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-sm font-semibold"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="odd:bg-gray-50 hover:bg-gray-100">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-sm text-gray-800">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={table.getState().pagination.pageIndex + 1}
        totalPages={table.getPageCount()}
        itemsPerPage={pageSize}
        onPageChange={(page) => table.setPageIndex(page - 1)}
        onItemsPerPageChange={(size) => {
          setPageSize(size);
          table.setPageSize(size);
        }}
        showItemsPerPage={showItemsPerPage}
      />
    </div>
  );
};

export default DataTable;
