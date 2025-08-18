import {
  addOrderApi,
  deleteOrderApi,
  getCheckExistCustomerPhone,
  getOrderAddInfoApi,
  getOrdersApi,
} from '@/apis/orders.api';
import type {
  AddOrderResponse,
  CustomerCheckResponse,
  DeleteOrderResponse,
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
    refetchOnWindowFocus: false,
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
  const { showError, showSuccess } = useToast();

  return useMutation<DeleteOrderResponse, Error, string>({
    mutationFn: (requestId: string) => deleteOrderApi(requestId),
    onSuccess: (data) => {
      if (data.success) {
        showSuccess(data.message || 'Request cancelled successfully!');
      } else {
        showError(data.message || 'Request cancelled fail!');
      }
    },
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
