import { useEffect, useState } from 'react';

import { AppTable } from '@/components/table/app-table/AppTable';
import { STATUS_HR } from '@/constants/dropdown/status-hr';
// import { data } from '@/constants/mock-data/mock-data-maids';
import { useGetHelpers } from '@/hooks/api/useHelpers.api';
import { useAppNavigate } from '@/hooks/common/useAppNavigate';
import { useHelperRealTime } from '@/hooks/common/useHelperRealTime';
import { usePageSize } from '@/hooks/common/usePageSize';
import { useSearchConfig } from '@/hooks/common/useSearchConfig';
import { useStatusFilter } from '@/hooks/common/useStatusFilter';
import { useToast } from '@/hooks/common/useToast';
import { helpersColumns } from '@/types/table/column/helper-column';
import type { PaginationState } from '@tanstack/react-table';

const MaidsPage = () => {
  const { showError } = useToast();
  const [maids, setMaids] = useState([]);
  const navigateTo = useAppNavigate();
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

  useHelperRealTime();

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
  };

  const {
    data: maidsData,
    isLoading,
    error,
    isError,
    isFetching,
  } = useGetHelpers(params);

  useEffect(() => {
    if (maidsData) {
      const test = maidsData || [];
      setMaids(test.helpers || []); // Thay đổi từ staffs thành helpers
    }
  }, [maidsData]);
  useEffect(() => {
    if (isError) {
      showError(error?.message || 'An error occurred while fetching maids.');
    }
  }, [isError, error, showError]);

  const handleEdit = (row: any) => {
    navigateTo(`/maids/edit/${row._id}`);
  };

  const handleView = (row: any) => {
    // Update this based on your view requirements
    navigateTo(`/maids/detail/${row._id}`);
  };

  console.log('Maids data:', maids); // Kiểm tra dữ liệu maids

  return (
    <AppTable
      data={maids}
      columns={helpersColumns(handleView, handleEdit)}
      pageHeaderTitle="Maids List"
      permissionModule="helpers"
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
