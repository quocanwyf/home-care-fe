import { useEffect, useState } from 'react';

import { AppTable } from '@/components/table/AppTable';
import { STATUS_HR } from '@/constants/dropdown/status-hr';
// import { data } from '@/constants/mock-data/mock-data-staffs';
import { useGetHRs } from '@/hooks/api/useHRs';
import { usePageSize } from '@/hooks/common/usePageSize';
import { useSearchConfig } from '@/hooks/common/useSearchConfig';
import { useStatusFilter } from '@/hooks/common/useStatusFilter';
import { useToast } from '@/hooks/common/useToast';
import { staffMaidColumns } from '@/types/table/column/staff-maid-columns';
import type { PaginationState } from '@tanstack/table-core';

const StaffsPage = () => {
  const { showError } = useToast();
  const [staffs, setStaffs] = useState([]);

  const [searchKeyword, setSearchKeyword] = useState('');

  const [currentPagination, setCurrentPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { statusFilter, handleStatusChange, resetFilter } = useStatusFilter({
    staffs,
    initialStatus: 'all',
  });

  const { pageSize, handlePageSizeChange, resetPageSize } = usePageSize({
    initialPageSize: 10,
  });

  useSearchConfig({
    placeholder: 'By staffs phone number or id...',
    onSearch: (keyword) => {
      setSearchKeyword(keyword);
    },
  });

  const handlePaginationChange = (pagination: PaginationState) => {
    setCurrentPagination(pagination);
  };

  const resetAllFilters = () => {
    resetFilter();
    resetPageSize();
  };

  const params = {
    status: statusFilter ?? 'all',
    limit: pageSize ?? 10,
    page: currentPagination.pageIndex + 1,
    search: searchKeyword ?? '',
    type: 'staff',
  };

  const {
    data: staffsData,
    isLoading,
    error,
    isError,
    isFetching,
  } = useGetHRs(params);

  useEffect(() => {
    if (staffsData) {
      const test = staffsData || [];
      setStaffs(test.result || []);
    }
  }, [staffsData]);

  useEffect(() => {
    if (isError) {
      showError(error?.message || 'An error occurred while fetching orders.');
    }
  }, [isError, error, showError]);

  console.log('staffs', staffsData);

  return (
    <AppTable
      data={staffs}
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
      //pagination variable and function
      onPaginationChange={handlePaginationChange}
      //reset filters
      onResetFilters={resetAllFilters}
      // isLoading
      isLoading={isLoading || isFetching}
      totalData={staffsData?.totalHRs || 1}
    />
  );
};

export default StaffsPage;
