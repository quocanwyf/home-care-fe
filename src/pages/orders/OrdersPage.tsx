import { useState } from 'react';

import { AppTable } from '@/components/table/AppTable';
import { STATUS_ORDERS } from '@/constants/dropdown/status-orders';
import { data } from '@/constants/mock-data/mock-data-orders';
import { useDateRangeConfig } from '@/hooks/useDateRangeConfig';
import { usePageSize } from '@/hooks/usePageSize';
import { useSearchConfig } from '@/hooks/useSearchConfig';
import { useStatusFilter } from '@/hooks/useStatusFilter';
import { orderColumn } from '@/types/table/column/order-column';
import type { PaginationState } from '@tanstack/react-table';

const OrdersPage = () => {
  //có 5 cái mục search cần gọi api là: pagination, status, pageSize, dateRange,search
  const [searchKeyword, setSearchKeyword] = useState('');
  //1pagination
  const [currentPagination, setCurrentPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  //2status
  const { statusFilter, filteredData, handleStatusChange, resetFilter } =
    useStatusFilter({
      data,
      initialStatus: 'all',
    });
  //3pageSize
  const { pageSize, handlePageSizeChange, resetPageSize } = usePageSize({
    initialPageSize: 10,
  });
  //dateRange
  const { dateRange } = useDateRangeConfig();

  // useDateRangeConfig();

  //5search
  useSearchConfig({
    placeholder: 'Search by order id...',
    onSearch: (keyword) => {
      setSearchKeyword(keyword);
      console.log('Searching for:', keyword);
    },
  });

  const handlePaginationChange = (pagination: PaginationState) => {
    setCurrentPagination(pagination);
  };

  const resetAllFilters = () => {
    resetFilter();
    resetPageSize();
  };

  const payload = {
    status: statusFilter,
    limit: pageSize,
    fromDate: dateRange.from,
    toDate: dateRange.to,
    page: currentPagination.pageIndex,
    search: searchKeyword,
  };

  console.log('Payload for API:', payload);
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
      //pagination variable and function
      onPaginationChange={handlePaginationChange}
      //reset filters
      onResetFilters={resetAllFilters}
      // isLoading
    />
  );
};

export default OrdersPage;
