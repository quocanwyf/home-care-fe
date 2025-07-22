// columns/orderColumns.ts
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

import OrderStatusBadge from '@/components/common/badge/StatusOrdersBadge';
import TableActions from '@/components/table/TableActions';
import type { Orders } from '@/types/table/objects/orders';
import type { ColumnDef } from '@tanstack/react-table';

export const orderColumn = (
  onView?: (row: Orders) => void,
  onEdit?: (row: Orders) => void,
  onDelete?: (row: Orders) => void
): ColumnDef<Orders, unknown>[] => [
  {
    accessorKey: 'orderId',
    header: 'Order ID',
  },
  {
    accessorKey: 'phoneNumberCustomers',
    header: 'Phone number',
  },
  {
    accessorKey: 'serviceCategory',
    header: 'Service Category',
  },
  {
    accessorKey: 'orderDate',
    header: 'Order Date',
    cell: ({ row }) =>
      format(new Date(row.original.orderDate), 'dd/MM/yyyy HH:mm:ss', {
        locale: vi,
      }),
  },
  {
    accessorKey: 'cost',
    header: 'Cost',
    cell: ({ row }) => `${row.original.cost.toLocaleString()} đ`,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <OrderStatusBadge status={row.original.status.status} />,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <TableActions
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        row={row.original}
      />
    ),
  },
];
