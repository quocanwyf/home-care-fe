import OrderStatusBadge from '@/components/common/badge/StatusOrdersBadge';
import TableActions from '@/components/common/button/TableActions';
import TableDetailActions from '@/components/common/button/TableDetailActions';
import type { Orders, RequestDetail } from '@/types/table/objects/orders';
import type { ColumnDef } from '@tanstack/react-table';

import type { ObjectsWithStatus } from '../objects/union-objects';

export const orderColumn = (
  onView?: (row: Orders) => void,
  // onEdit?: (row: Orders) => void,
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
    cell: ({ row }) => {
      const orderData = row.original;

      const canCancel = ['pending', 'assigned'].includes(
        orderData.status?.toLowerCase()
      );

      return (
        <TableActions
          onView={onView}
          // onEdit={onEdit}
          onDelete={onDelete}
          row={row.original}
          canCancel={canCancel}
        />
      );
    },
  },
];

export const orderDetailColumns = (
  onCancel: (detailId: string) => void,
  onStart: (detailId: string) => void,
  onComplete: (detailId: string) => void,
  isActionLoading: boolean = false
): ColumnDef<RequestDetail>[] => [
  {
    accessorKey: 'startTime',
    header: 'Start Time',
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue('startTime')}</span>
    ),
  },
  {
    accessorKey: 'endTime',
    header: 'End Time',
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue('endTime')}</span>
    ),
  },
  {
    accessorKey: 'workingDate',
    header: 'Working Date',
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue('workingDate')}</span>
    ),
  },
  {
    accessorKey: 'helper',
    header: 'Helper',
    cell: ({ row }) => {
      const helper = row.getValue('helper') as {
        fullName: string;
        phone: string;
      };
      return (
        <span className="font-medium">
          {helper?.fullName || 'Has not assigned'}
        </span>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return <OrderStatusBadge status={status as ObjectsWithStatus} />;
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const detailId = row.original.detailId;

      const handleCancel = () => {
        onCancel(detailId);
      };

      const handleStart = () => {
        onStart(detailId);
      };

      const handleComplete = () => {
        onComplete(detailId);
      };

      return (
        <TableDetailActions
          status={status}
          onCancel={handleCancel}
          onStartWork={handleStart}
          onCompleteWork={handleComplete}
          isLoading={isActionLoading}
        />
      );
    },
  },
];
