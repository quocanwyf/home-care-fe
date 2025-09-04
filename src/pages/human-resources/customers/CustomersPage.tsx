import { useEffect, useState } from 'react';

import { AppTable } from '@/components/table/app-table/AppTable';
import { STATUS_CUSTOMER } from '@/constants/dropdown/status-customers';
// import { data } from '@/constants/mock-data/mock-data-customers';
import { useGetCustomers } from '@/hooks/api/useCustomers.api';
import { useAppNavigate } from '@/hooks/common/useAppNavigate';
import { usePageSize } from '@/hooks/common/usePageSize';
import { useSearchConfig } from '@/hooks/common/useSearchConfig';
import { useStatusFilter } from '@/hooks/common/useStatusFilter';
import { useToast } from '@/hooks/common/useToast';
import { customerColumn } from '@/types/table/column/customer-column';
import type { PaginationState } from '@tanstack/react-table';

const CustomersPage = () => {
  const navigateTo = useAppNavigate();
  const { showError } = useToast();
  const [customers, setCustomers] = useState([]);

  const [searchKeyword, setSearchKeyword] = useState('');

  const [currentPagination, setCurrentPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { statusFilter, handleStatusChange, resetFilter } = useStatusFilter({
    customers,
    initialStatus: 'all',
  });

  const { pageSize, handlePageSizeChange, resetPageSize } = usePageSize({
    initialPageSize: 10,
  });

  useSearchConfig({
    placeholder: 'By customer phone number...',
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
    data: customersData,
    isLoading,
    error,
    isError,
    isFetching,
  } = useGetCustomers(params);

  useEffect(() => {
    if (customersData) {
      const test = customersData || [];
      setCustomers(test.result || []);
    }
  }, [customersData]);

  useEffect(() => {
    if (isError) {
      showError(error?.message || 'An error occurred while fetching orders.');
    }
  }, [isError, error, showError]);

  console.log(customers);

  const handleView = (row: any) => {
    navigateTo(`/customers/detail/${row.phoneNumber}`);
    console.log(row);
  };

  return (
    <AppTable
      data={customers}
      columns={customerColumn(handleView)}
      pageHeaderTitle="Customers List"
      //status variable and function
      statusFilter={statusFilter}
      onStatusFilterChange={handleStatusChange}
      listStatusFilter={STATUS_CUSTOMER}
      //pagesize variable and function
      pageSize={pageSize}
      onPageSizeChange={handlePageSizeChange}
      //pagination variable and function
      onPaginationChange={handlePaginationChange}
      //reset filters
      onResetFilters={resetAllFilters}
      isLoading={isLoading || isFetching}
      totalData={customersData?.totalCustomers || 1}
      showAddButton={false}
    />
  );
};

export default CustomersPage;
