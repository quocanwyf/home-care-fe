import {
  addOrderApi,
  cancelOrderDetailApi,
  changeRequestDetailStatusApi,
  changeRequestStatusApi,
  deleteOrderApi,
  getCheckExistCustomerPhone,
  getOrderAddInfoApi,
  getOrderDetailApi,
  getOrdersApi,
} from '@/apis/orders.api';
import type {
  AddOrderResponse,
  CustomerCheckResponse,
  DeleteOrderResponse,
  OrderDetailResponse,
  OrderFormData,
  OrderParams,
} from '@/types/params/order-params';
import { useMutation, useQuery } from '@tanstack/react-query';

import { useToast } from '../common/useToast';

export const useGetOrders = (params: OrderParams) => {
  return useQuery({
    queryKey: ['orders', params], // `params` là một phần của key, khi nó thay đổi, query sẽ fetch lại
    queryFn: ({ signal }) => getOrdersApi(params, signal),
    refetchOnWindowFocus: true,
  });
};

export const useCheckCustomerExist = () => {
  return useMutation<CustomerCheckResponse, Error, string>({
    mutationFn: (phone: string) => getCheckExistCustomerPhone(phone),
  });
};

export const useGetOrderAddInfo = () => {
  return useQuery({
    queryKey: ['order-add-info'],
    queryFn: ({ signal }) => getOrderAddInfoApi(signal),
    staleTime: 10 * 60 * 1000, // 10 minutes - stable data
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

export const useAddOrder = () => {
  const { showError } = useToast();
  return useMutation<AddOrderResponse, Error, OrderFormData>({
    mutationFn: (orderData: OrderFormData) => addOrderApi(orderData),
    onError: (error) => {
      showError('Error adding order: ' + error.message);
    },
  });
};

export const useDeleteOrder = () => {
  const { showError } = useToast();

  return useMutation<DeleteOrderResponse, Error, string>({
    mutationFn: (requestId: string) => deleteOrderApi(requestId),

    onError: (error) => {
      // Handle different error messages từ API spec
      let errorMessage = 'An error occurred while fetching requests';

      if (error.message === 'Request not found') {
        errorMessage = 'Request not found';
      } else if (error.message === 'Request cancelled fail!') {
        errorMessage = 'Request cancelled fail!';
      } else if (error.message.includes('Request cancelled successfully')) {
        errorMessage = 'Request cancelled successfully!';
      }

      showError(errorMessage);
    },
  });
};

export const useGetOrderDetail = (requestId: string | undefined) => {
  return useQuery<OrderDetailResponse, Error>({
    queryKey: ['order-detail', requestId],
    queryFn: ({ signal }) => {
      if (!requestId) {
        throw new Error('Request ID is required');
      }
      return getOrderDetailApi(requestId, signal);
    },
    enabled: !!requestId, // Only run query if requestId exists
    // staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      // Don't retry for 404 errors
      if (error.message === 'Order not found!') {
        return false;
      }
      return failureCount < 2;
    },
  });
};

export const useCancelOrderDetail = () => {
  const { showError } = useToast();

  return useMutation<{ success: boolean; message: string }, Error, string>({
    mutationFn: (requestDetailId: string) =>
      cancelOrderDetailApi(requestDetailId),

    onError: (error) => {
      // Handle different error messages
      let errorMessage = 'An error occurred while canceling request detail';

      if (error.message === 'Request detail not found') {
        errorMessage = 'Request detail not found';
      } else if (error.message === 'Cannot cancel this request detail') {
        errorMessage =
          'Cannot cancel this request detail. Check status requirements.';
      } else if (error.message === 'Server error occurred') {
        errorMessage = 'Server error occurred';
      }

      showError(errorMessage);
    },
  });
};

export const useChangeRequestDetailStatus = () => {
  const { showError } = useToast();

  return useMutation<
    { success: boolean; message: string },
    Error,
    { detailId: string; status: 'inProgress' | 'completed' }
  >({
    mutationFn: ({ detailId, status }) =>
      changeRequestDetailStatusApi(detailId, status),

    onError: (error) => {
      let errorMessage = 'An error occurred while fetching requests';

      if (error.message === 'Request detail not found') {
        errorMessage = 'Request detail not found';
      } else if (
        error.message === 'Cannot change status of this request detail'
      ) {
        errorMessage = 'Cannot change status of this request detail';
      } else if (
        error.message === 'An error occurred while fetching requests'
      ) {
        errorMessage = 'An error occurred while fetching requests';
      }

      showError(errorMessage);
    },
  });
};

export const useChangeRequestStatus = () => {
  const { showError } = useToast();

  return useMutation<
    { success: boolean; message: string },
    Error,
    { requestId: string; status: 'completed' }
  >({
    mutationFn: ({ requestId, status }) =>
      changeRequestStatusApi(requestId, status),

    onError: (error) => {
      let errorMessage = 'An error occurred while processing payment';

      if (error.message === 'Request not found') {
        errorMessage = 'Request not found';
      } else if (error.message === 'Cannot change status of this request') {
        errorMessage = 'Cannot process payment for this request';
      } else if (
        error.message === 'An error occurred while processing payment'
      ) {
        errorMessage = 'An error occurred while processing payment';
      }

      showError(errorMessage);
    },
  });
};
