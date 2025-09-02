// columns/orderColumns.ts
// import OrderStatusBadge from '@/components/common/badge/StatusOrdersBadge';
import TableActions from '@/components/common/button/TableActions';
import type { Customers } from '@/types/table/objects/customers';
import type { ColumnDef } from '@tanstack/react-table';

export const customerColumn = (
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
    accessorKey: 'location',
    header: 'Location',
    cell: ({ row }) => {
      const location = row.getValue('location') as Customer['location'];

      if (!location || location.length === 0) {
        return <span className="text-muted-foreground">No address</span>;
      }

      const firstLocation = location[0];
      return (
        <div className="max-w-[200px]">
          <div className="text-sm">{firstLocation.detailAddress}</div>
          <div className="text-muted-foreground text-xs">
            {firstLocation.ward}, {firstLocation.district}
          </div>
          <div className="text-muted-foreground text-xs">
            {firstLocation.province}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'registerDate',
    header: 'Register Date',
  },
  {
    accessorKey: 'point',
    header: 'Points',
    cell: ({ row }) =>
      new Intl.NumberFormat('vi-VN').format(row.original.point) + ' Ps',
  },
  // {
  //   accessorKey: 'status',
  //   header: 'Status',
  //   cell: ({ row }) => <OrderStatusBadge status={row.original.status} />,
  // },
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
