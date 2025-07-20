// columns/orderColumns.ts
import OrderStatusBadge from '@/components/common/badge/StatusOrdersBadge';
import TableActions from '@/components/table/TableActions';
import type { Customers } from '@/types/table/objects/customers';
import type { ColumnDef } from '@tanstack/react-table';

export const customerColumn = (
  onView?: (row: Customers) => void,
  onEdit?: (row: Customers) => void,
  onDelete?: (row: Customers) => void,
  onBan?: (row: Customers) => void,
  onUnban?: (row: Customers) => void
): ColumnDef<Customers, unknown>[] => [
  {
    accessorKey: 'phoneNumber',
    header: 'Phone number',
  },
  {
    accessorKey: 'fullName',
    header: 'Full name',
  },
  {
    accessorKey: 'address',
    header: 'Address',
  },
  {
    accessorKey: 'points',
    header: 'Points',
    cell: ({ row }) =>
      new Intl.NumberFormat('vi-VN').format(row.original.points),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <OrderStatusBadge status={row.original.status.status} />,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const isBanned = row.original.status.status === 'banned';
      return (
        <TableActions
          onView={isBanned ? undefined : onView}
          onEdit={isBanned ? undefined : onEdit}
          onDelete={isBanned ? undefined : onDelete}
          onBan={isBanned ? undefined : onBan}
          onUnban={isBanned ? onUnban : undefined}
          row={row.original}
        />
      );
    },
  },
];
