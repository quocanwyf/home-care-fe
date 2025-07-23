import { AppTable } from '@/components/table/AppTable';
import { STATUS_HR } from '@/constants/dropdown/status-hr';
import { data } from '@/constants/mock-data/mock-data-staffs';
import { usePageSize } from '@/hooks/usePageSize';
import { useSearchConfig } from '@/hooks/useSearchConfig';
import { useStatusFilter } from '@/hooks/useStatusFilter';
import { staffMaidColumns } from '@/types/table/column/staff-maid-columns';
import { resetAllFilters } from '@/utils/reset-all-filters';

const StaffsPage = () => {
  const { statusFilter, filteredData, handleStatusChange, resetFilter } =
    useStatusFilter({
      data,
      initialStatus: 'all',
    });

  const { pageSize, handlePageSizeChange, resetPageSize } = usePageSize({
    initialPageSize: 10,
  });

  useSearchConfig({
    placeholder: 'Search by staffs id or phone number...',
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
      columns={staffMaidColumns(
        (row) => console.log('Xem', row),
        (row) => console.log('Sửa', row),
        (row) => console.log('Xoá', row)
      )}
      pageHeaderTitle="Maids List"
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

export default StaffsPage;
