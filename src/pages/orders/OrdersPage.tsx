import { AppTable } from '@/components/table/AppTable';
import { data } from '@/constants/mock-data/mock-data-orders';
import { usePageSize } from '@/hooks/usePageSize';
import { useStatusFilter } from '@/hooks/useStatusFilter';
import { orderColumns } from '@/types/table/column/order-column';

const OrdersPage = () => {
  const { statusFilter, filteredData, handleStatusChange, resetFilter } =
    useStatusFilter({
      data,
      initialStatus: 'all',
    });
  const { pageSize, handlePageSizeChange, resetPageSize } = usePageSize({
    initialPageSize: 10,
  });

  const resetAllFilters = () => {
    resetFilter();
    resetPageSize();
  };
  return (
    <AppTable
      data={filteredData}
      columns={orderColumns(
        (row) => console.log('Xem', row),
        (row) => console.log('Sửa', row),
        (row) => console.log('Xoá', row)
      )}
      pageHeaderTitle="Orders List"
      //status variable and function
      statusFilter={statusFilter}
      onStatusFilterChange={handleStatusChange}
      //pagesize variable and function
      pageSize={pageSize}
      onPageSizeChange={handlePageSizeChange}
      //reset filters
      onResetFilters={resetAllFilters}
      isLoading
    />
  );
};

export default OrdersPage;
