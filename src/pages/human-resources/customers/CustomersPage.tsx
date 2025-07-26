import { AppTable } from '@/components/table/AppTable';
import { STATUS_HR } from '@/constants/dropdown/status-customers';
import { data } from '@/constants/mock-data/mock-data-customers';
import { usePageSize } from '@/hooks/common/usePageSize';
import { useSearchConfig } from '@/hooks/common/useSearchConfig';
import { useStatusFilter } from '@/hooks/common/useStatusFilter';
import { customerColumn } from '@/types/table/column/customer-column';

const CustomersPage = () => {
  const { statusFilter, filteredData, handleStatusChange, resetFilter } =
    useStatusFilter({
      data,
      initialStatus: 'all',
    });

  const { pageSize, handlePageSizeChange, resetPageSize } = usePageSize({
    initialPageSize: 10,
  });

  useSearchConfig({
    placeholder: 'Search by customer phone number...',
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
      columns={customerColumn(
        (row) => console.log('Xem', row),
        (row) => console.log('Sửa', row),
        (row) => console.log('Xoá', row),
        (row) => console.log('Xoá', row),
        (row) => console.log('Bỏ cấm', row)
      )}
      pageHeaderTitle="Customers List"
      //status variable and function
      statusFilter={statusFilter}
      onStatusFilterChange={handleStatusChange}
      listStatusFilter={STATUS_HR}
      //pagesize variable and function
      pageSize={pageSize}
      onPageSizeChange={handlePageSizeChange}
      //reset filters
      onResetFilters={resetAllFilters}
      // isLoading
    />
  );
};

export default CustomersPage;
