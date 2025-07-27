// columns/orderColumns.ts
import OrderStatusBadge from '@/components/common/badge/StatusOrdersBadge';
import TableActions from '@/components/table/TableActions';
import type { Customers } from '@/types/table/objects/customers';
import type { ColumnDef } from '@tanstack/react-table';

export const customerColumn = (
  onView?: (row: Customers) => void | undefined,
  onEdit?: (row: Customers) => void | undefined,
  onDelete?: (row: Customers) => void | undefined,
  onBan?: (row: Customers) => void | undefined,
  onUnban?: (row: Customers) => void | undefined,
  onViewHistory?: (row: Customers) => void | undefined
): ColumnDef<Customers>[] => [
  {
    accessorKey: 'phoneNumber',
    header: 'Phone number',
  },
  {
    accessorKey: 'fullName',
    header: 'Full name',
  },
  {
    // Tạo custom accessor cho location
    accessorKey: 'location',
    header: 'Location',
    cell: ({ row }) => {
      const location = row.getValue('location') as Customers['location'];
      return (
        <div className="max-w-[200px]">
          <div className="text-sm">{location.addressNum}</div>
          <div className="text-muted-foreground text-xs">
            {location.ward}, {location.city}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'point',
    header: 'Points',
    cell: ({ row }) =>
      new Intl.NumberFormat('vi-VN').format(row.original.point) + ' Ps',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <OrderStatusBadge status={row.original.status} />,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const isBanned = row.original.status === 'banned';
      return (
        <TableActions
          onView={undefined}
          onEdit={undefined}
          onDelete={undefined}
          onBan={onBan}
          onUnban={isBanned ? onUnban : undefined}
          onViewHistory={onViewHistory}
          row={row.original}
        />
      );
    },
  },
];
