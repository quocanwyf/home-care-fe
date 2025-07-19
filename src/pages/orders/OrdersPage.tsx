import { AppTable } from '@/components/common/AppTable';
import { ORDER_COLUMN } from '@/constants/column-table/order-column';
import { data } from '@/constants/mock-data/mock-data-order-table';

const OrdersPage = () => {
  const dataOrder = data;
  return (
    <div className="flex min-h-screen flex-col p-4">
      <h1 className="mb-4 text-lg font-bold">Order Table</h1>
      <AppTable data={dataOrder} columns={ORDER_COLUMN} />
      <div className="h-5"></div>
    </div>
  );
};

export default OrdersPage;
