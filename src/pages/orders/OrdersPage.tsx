import { AppTable } from '@/components/table/AppTable';
import { data } from '@/constants/mock-data/mock-data-orders';
import { useStatusFilter } from '@/hooks/useStatusFilter';
import { orderColumns } from '@/types/table/column/order-column';

const OrdersPage = () => {
  const { statusFilter, filteredData, handleStatusChange } = useStatusFilter({
    data,
    initialStatus: 'all',
  });
  return (
    <AppTable
      data={filteredData}
      columns={orderColumns(
        (row) => console.log('Xem', row),
        (row) => console.log('Sửa', row),
        (row) => console.log('Xoá', row)
      )}
      pageHeaderTitle="Orders List"
      statusFilter={statusFilter}
      onStatusFilterChange={handleStatusChange}
      // isLoading
    />
  );
};

export default OrdersPage;
