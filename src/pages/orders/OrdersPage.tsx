import { useEffect, useState } from 'react';

import ConfirmDialog from '@/components/common/float-display/ConfirmDialog';
import { AppTable } from '@/components/table/AppTable';
import { STATUS_ORDERS } from '@/constants/dropdown/status-orders';
import { handleView } from '@/helpers/handle-table-actions';
// import { data } from '@/constants/mock-data/mock-data-orders';
import { useDeleteOrder, useGetOrders } from '@/hooks/api/useOrders.api';
import { useAppNavigate } from '@/hooks/common/useAppNavigate';
import { useConfirmation } from '@/hooks/common/useConfirmation';
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
  const navigateTo = useAppNavigate();

  const deleteOrderMutation = useDeleteOrder();

  const orderDeleteConfirmation = useConfirmation({
    deleteFunction: (requestId: string) =>
      deleteOrderMutation.mutateAsync(requestId),
    entityName: 'Order',
    onDeleteSuccess: () => {
      console.log('Order cancelled successfully, refreshing list...');
      refetchOrders();
    },
    onDeleteError: (error) => {
      console.error('Failed to cancel order:', error);
    },
    successMessage: 'Request cancelled successfully!',
    errorMessage: 'Request cancelled fail!',
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDeleteOrder = (row: any) => {
    orderDeleteConfirmation.openDeleteConfirmation(
      row.requestId || row.orderId,
      {
        cost: row.cost,
        orderDate: row.orderDate,
        phoneNumberCustomer: row.phoneNumberCustomers,
        serviceCategory: row.serviceCategory,
        status: row.status,
      }
    );
  };

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
    fromDate: dateRange.startDate ?? '',
    toDate: dateRange.endDate ?? '',
    page: currentPagination.pageIndex + 1,
    search: searchKeyword ?? '',
  };

  console.log('par', params);

  const {
    data: ordersFetchData,
    isLoading,
    isError,
    error,
    isFetching,
    refetch: refetchOrders,
  } = useGetOrders(params);

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
    <>
      <AppTable
        data={orders}
        columns={orderColumn(
          (row) =>
            handleView({ navigateTo, path: `/orders/detail/${row.orderId}` }),
          handleDeleteOrder
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
      <ConfirmDialog
        open={orderDeleteConfirmation.isDialogOpen}
        onOpenChange={orderDeleteConfirmation.closeDeleteConfirmation}
        title="Cancel Order"
        description={orderDeleteConfirmation
          .getDeleteDescription()
          .replace('delete', 'cancel')} // ✅ Change wording to "cancel"
        icon={true}
        danger={true}
        confirmText="Cancel Order"
        cancelText="Keep Order"
        onConfirm={orderDeleteConfirmation.handleDeleteConfirm}
      >
        <div />
      </ConfirmDialog>
    </>
  );
};

export default OrdersPage;
