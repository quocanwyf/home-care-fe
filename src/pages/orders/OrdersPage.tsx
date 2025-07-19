import DataTable from '@/components/common/table/DataTable';
import TableActions from '@/components/common/table/TableActions';
import { ORDER_COLUMN } from '@/constants/column-table/order-column';
import { data } from '@/constants/mock-data/mock-data-order-table';
import type { Order } from '@/types/table/order-type';

const OrdersPage = () => {
  const ordersData: Order[] = data;

  // Thêm actions vào dữ liệu
  const ordersWithActions = ordersData.map((order) => ({
    ...order,
    actions: <TableActions row={order} />,
  }));

  return (
    <div className="p-4">
      <DataTable<Order, Order>
        title="Orders List"
        data={ordersWithActions}
        columns={ORDER_COLUMN}
        addButtonText="Add Order"
        initialPageSize={10}
      />
    </div>
  );
};
export default OrdersPage;
