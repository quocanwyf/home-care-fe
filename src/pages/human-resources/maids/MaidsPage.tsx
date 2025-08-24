import { useEffect, useState } from 'react';

import { AppTable } from '@/components/table/app-table/AppTable';
import { STATUS_HR } from '@/constants/dropdown/status-hr';
// import { data } from '@/constants/mock-data/mock-data-maids';
import { useGetHRs } from '@/hooks/api/useHRs';
import { usePageSize } from '@/hooks/common/usePageSize';
import { useSearchConfig } from '@/hooks/common/useSearchConfig';
import { useStatusFilter } from '@/hooks/common/useStatusFilter';
import { useToast } from '@/hooks/common/useToast';
import { staffMaidColumns } from '@/types/table/column/staff-maid-columns';
import type { PaginationState } from '@tanstack/react-table';

const MaidsPage = () => {
  const { showError } = useToast();
  const [maids, setMaids] = useState([]);

  const [searchKeyword, setSearchKeyword] = useState('');

  const [currentPagination, setCurrentPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { statusFilter, handleStatusChange, resetFilter } = useStatusFilter({
    maids,
    initialStatus: 'all',
  });

  const { pageSize, handlePageSizeChange, resetPageSize } = usePageSize({
    initialPageSize: 10,
  });

  useSearchConfig({
    placeholder: 'By maids phone number or id...',
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
    type: 'helper',
  };

  const {
    data: maidsData,
    isLoading,
    error,
    isError,
    isFetching,
  } = useGetHRs(params);

  useEffect(() => {
    if (maidsData) {
      const test = maidsData || [];
      setMaids(test.result || []);
    }
  }, [maidsData]);

  useEffect(() => {
    if (isError) {
      showError(error?.message || 'An error occurred while fetching orders.');
    }
  }, [isError, error, showError]);

  return (
    <AppTable
      data={maids}
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
      totalData={maidsData?.totalHRs || 1}
    />
  );
};

export default MaidsPage;
