import { ObjectsStatusStyles } from '@/types/table/objects/union-objects';
import type { ObjectsWithStatus } from '@/types/table/objects/union-objects';

const OrderStatusBadge = ({
  status,
}: {
  status: ObjectsWithStatus['status'];
}) => {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${
        ObjectsStatusStyles[status]
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
