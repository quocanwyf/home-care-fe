import { AppTable } from '@/components/table/AppTable';
import { STATUS_ORDERS } from '@/constants/dropdown/status-orders';
import { data } from '@/constants/mock-data/mock-data-orders';
import { usePageSize } from '@/hooks/usePageSize';
import { useSearchConfig } from '@/hooks/useSearchConfig';
import { useStatusFilter } from '@/hooks/useStatusFilter';
import { orderColumn } from '@/types/table/column/order-column';
import { resetAllFilters } from '@/utils/reset-all-filters';

const OrdersPage = () => {
  const { statusFilter, filteredData, handleStatusChange, resetFilter } =
    useStatusFilter({
      data,
      initialStatus: 'all',
    });

  const { pageSize, handlePageSizeChange, resetPageSize } = usePageSize({
    initialPageSize: 10,
  });

  useSearchConfig({
    placeholder: 'Search by order id...',
    onSearch: (keyword) => {
      console.log('Searching for:', keyword);
    },
  });

  const resetAllFilters = () => {
    resetFilter();
    resetPageSize();
  };

  return (
    <AppTable
      data={filteredData}
      columns={orderColumn(
        (row) => console.log('Xem', row),
        (row) => console.log('Sửa', row),
        (row) => console.log('Xoá', row)
      )}
      pageHeaderTitle="Orders List"
      //status variable and function
      statusFilter={statusFilter}
      onStatusFilterChange={handleStatusChange}
      listStatusFilter={STATUS_ORDERS}
      //pagesize variable and function
      pageSize={pageSize}
      onPageSizeChange={handlePageSizeChange}
      //reset filters
      onResetFilters={resetAllFilters}
      // isLoading
    />
  );
};

export default OrdersPage;
