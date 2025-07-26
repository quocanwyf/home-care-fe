import { useEffect, useState } from 'react';

import { AppTable } from '@/components/table/AppTable';
import { STATUS_ORDERS } from '@/constants/dropdown/status-orders';
// import { data } from '@/constants/mock-data/mock-data-orders';
import { useOrders } from '@/hooks/api/useOrders.api';
import { useDateRangeConfig } from '@/hooks/common/useDateRangeConfig';
import { usePageSize } from '@/hooks/common/usePageSize';
import { useSearchConfig } from '@/hooks/common/useSearchConfig';
import { useStatusFilter } from '@/hooks/common/useStatusFilter';
import { useToast } from '@/hooks/common/useToast';
import { orderColumn } from '@/types/table/column/order-column';
import type { PaginationState } from '@tanstack/react-table';

const OrdersPage = () => {
  const { showError } = useToast();
  const [orders, setOrders] = useState([]);

  //có 5 cái mục search cần gọi api là: pagination, status, pageSize, dateRange,search
  const [searchKeyword, setSearchKeyword] = useState('');
  //1pagination
  const [currentPagination, setCurrentPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  //2status
  const { statusFilter, handleStatusChange, resetFilter } = useStatusFilter({
    orders,
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
    placeholder: 'By order id...',
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
    fromDate: dateRange.from ?? '',
    toDate: dateRange.to ?? '',
    page: currentPagination.pageIndex + 1,
    search: searchKeyword ?? '',
  };

  const {
    data: ordersFetchData,
    isLoading,
    isError,
    error,
    isFetching,
  } = useOrders(params);

  useEffect(() => {
    if (ordersFetchData) {
      const test = ordersFetchData || [];
      setOrders(test.result || []);
    }
  }, [ordersFetchData]);

  useEffect(() => {
    if (isError) {
      showError(error?.message || 'An error occurred while fetching orders.');
    }
  }, [isError, error, showError]);

  return (
    <AppTable
      data={orders}
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
      isLoading={isLoading || isFetching}
      totalData={ordersFetchData?.totalOrders || 1}
    />
  );
};

export default OrdersPage;
