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
  },
  {
    accessorKey: 'cost',
    header: 'Cost',
    cell: ({ row }) => {
      const costValue = row.original.cost;

      // 1. Kiểm tra xem cost có phải là null hoặc undefined không
      if (costValue == null) return 'N/A';

      // 2. Chuyển đổi giá trị chuỗi sang số
      const costNumber = parseFloat(String(costValue));

      // 3. Kiểm tra xem việc chuyển đổi có thành công không
      if (isNaN(costNumber)) return 'N/A';

      // 4. Nếu mọi thứ đều ổn, định dạng số
      return `${costNumber.toLocaleString()} đ`;
    },
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
        row={row.original}
      />
    ),
  },
];
