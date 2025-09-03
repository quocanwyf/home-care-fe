import TableActions from '@/components/common/button/TableActions';
import { formatCurrency } from '@/helpers/format-currency';
import type { CustomerOrderData } from '@/types/params/customer-params';
import type { ColumnDef } from '@tanstack/react-table';

export const customerOrderColumns = (
  onViewHistory?: (row: CustomerOrderData) => void | undefined
): ColumnDef<CustomerOrderData>[] => [
  {
    accessorKey: 'orderId',
    header: 'Order ID',
    cell: ({ row }) => (
      <div className="font-medium text-blue-600">{row.getValue('orderId')}</div>
    ),
  },
  {
    accessorKey: 'orderDate',
    header: 'Order Date',
    cell: ({ row }) => {
      const dateTime = row.getValue('orderDate') as string;
      const [date, time] = dateTime.split(' ');
      return (
        <div>
          <div className="font-medium">{date}</div>
          <div className="text-xs text-gray-500">{time}</div>
        </div>
      );
    },
  },
  {
    accessorKey: 'serviceCategory',
    header: 'Service',
    cell: ({ row }) => (
      <div
        className="max-w-[150px] truncate"
        title={row.getValue('serviceCategory')}
      >
        {row.getValue('serviceCategory')}
      </div>
    ),
  },
  {
    accessorKey: 'cost',
    header: 'Cost',
    cell: ({ row }) => {
      const cost = parseFloat(row.getValue('cost'));
      return (
        <div className="font-medium text-green-600">{formatCurrency(cost)}</div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        inProgress: 'bg-blue-100 text-blue-800',
        completed: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
        waitPayment: 'bg-orange-100 text-orange-800',
      };

      return (
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
            statusColors[status as keyof typeof statusColors] ||
            'bg-gray-100 text-gray-800'
          }`}
        >
          {status}
        </span>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      return (
        <TableActions
          onView={undefined}
          onEdit={undefined}
          onDelete={undefined}
          // onBan={onBan}
          // onUnban={isBanned ? onUnban : undefined}
          onViewHistory={onViewHistory}
          row={row.original}
        />
      );
    },
  },
];
