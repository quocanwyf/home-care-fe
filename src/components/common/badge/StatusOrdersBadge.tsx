import type { OrdersWithStatus } from '@/types/table/orders';
import { OrdersStatusStyles } from '@/types/table/orders';

const OrderStatusBadge = ({
  status,
}: {
  status: OrdersWithStatus['status'];
}) => {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${
        OrdersStatusStyles[status]
      }`}
    >
      {status === 'inProgress'
        ? 'in progress'
        : status === 'waitPayment'
          ? 'wait payment'
          : status}
    </span>
  );
};
export default OrderStatusBadge;
