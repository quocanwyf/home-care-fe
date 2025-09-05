import OrderStatusBadge from '@/components/common/badge/StatusOrdersBadge';
import TableActions from '@/components/common/button/TableActions';
import type { CoefficientItem } from '@/types/table/objects/coefficient';
import type { ColumnDef } from '@tanstack/react-table';

export const coefficientColumn = (
  onEdit?: (row: CoefficientItem) => void
): ColumnDef<CoefficientItem, unknown>[] => [
  {
    accessorKey: '_id',
    header: 'Coefficient ID',
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.original._id.slice(-8)}</span>
    ),
  },
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => <div className="font-medium">{row.original.title}</div>,
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[200px] text-sm">
        {row.original.description}
      </div>
    ),
  },
  {
    accessorKey: 'value',
    header: 'Multiplier',
    cell: ({ row }) => (
      <div className="text-center">
        <span className="text-overlay-slider inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm">
          ×{row.original.value}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <OrderStatusBadge status={row.original.status} />,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <TableActions onEdit={onEdit} row={row.original} />,
  },
];
