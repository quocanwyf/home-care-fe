import { useEffect, useState } from 'react';

import { AppTable } from '@/components/table/app-table/AppTable';
// import { STATUS_HR } from '@/constants/dropdown/status-hr';
// import { data } from '@/constants/mock-data/mock-data-staffs';
import { useGetStaffs } from '@/hooks/api/useStaffs.api';
import { useAppNavigate } from '@/hooks/common/useAppNavigate';
import { usePageSize } from '@/hooks/common/usePageSize';
import { useSearchConfig } from '@/hooks/common/useSearchConfig';
import { useStatusFilter } from '@/hooks/common/useStatusFilter';
import { useToast } from '@/hooks/common/useToast';
import { staffsColumns } from '@/types/table/column/staff-column';
import type { PaginationState } from '@tanstack/react-table';

const StaffsPage = () => {
  const navigateTo = useAppNavigate();
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
  };

  const {
    data: staffsData,
    isLoading,
    error,
    isError,
    isFetching,
  } = useGetStaffs(params);

  useEffect(() => {
    if (staffsData) {
      const test = staffsData || [];
      setStaffs(test.staffs || []);
    }
  }, [staffsData]);
  console.log(staffs);

  useEffect(() => {
    if (isError) {
      showError(error?.message || 'An error occurred while fetching staffs.');
    }
  }, [isError, error, showError]);

  const handleEdit = (row: any) => {
    navigateTo(`/staffs/edit/${row._id}`);
  };

  const handleView = (row: any) => {
    navigateTo(`/staffs/detail/${row._id}`);
  };

  return (
    <AppTable
      data={staffs}
      columns={staffsColumns(handleView, handleEdit)}
      pageHeaderTitle="Staffs List"
      permissionModule="staffs"
      //status variable and function
      statusFilter={statusFilter}
      onStatusFilterChange={handleStatusChange}
      listStatusFilter={['all']}
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
