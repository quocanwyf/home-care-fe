import {
  addOrderApi,
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
    placeholderData: undefined,
    staleTime: 1 * 60 * 1000,
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
    staleTime: 5 * 60 * 1000, // 5 minutes
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
