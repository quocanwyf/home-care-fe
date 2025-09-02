import OrderStatusBadge from '@/components/common/badge/StatusOrdersBadge';
import TableActions from '@/components/common/button/TableActions';
import type { Service } from '@/types/table/objects/services';
import type { ColumnDef } from '@tanstack/react-table';

export const servicesColumns = (
  onView?: (row: Service) => void,
  onEdit?: (row: Service) => void,
  onDelete?: (row: Service) => void
): ColumnDef<Service, unknown>[] => [
  {
    accessorKey: '_id',
    header: 'Service ID',
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.original._id.slice(-8)}</span>
    ),
  },
  {
    accessorKey: 'title',
    header: 'Service Name',
    cell: ({ row }) => (
      <div className="max-w-[180px]">
        <div className="font-medium">{row.original.title}</div>
      </div>
    ),
  },
  {
    accessorKey: 'basicPrice',
    header: 'Basic Price',
    cell: ({ row }) => (
      <span className="text-overlay-slider font-semibold">
        {new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(row.original.basicPrice)}
      </span>
    ),
  },
  {
    accessorKey: 'coefficientTitle',
    header: 'Coefficient',
    cell: ({ row }) => (
      <div>
        <div className="text-sm font-medium">
          {row.original.coefficientTitle}
        </div>
        <div className="text-muted-foreground text-xs">
          x{row.original.coefficientValue}
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[180px] truncate text-sm">
        {row.original.description}
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
    cell: ({ row }) => (
      <TableActions
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        canCancel
        row={row.original}
      />
    ),
  },
];
