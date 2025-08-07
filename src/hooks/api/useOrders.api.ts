import { getCheckExistCustomerPhone, getOrdersApi } from '@/apis/orders.api';
import type {
  CustomerCheckResponse,
  OrderParams,
} from '@/types/params/order-params';
import { useMutation, useQuery } from '@tanstack/react-query';

import { useToast } from '../common/useToast';

export const useGetOrders = (params: OrderParams) => {
  return useQuery({
    queryKey: ['orders', params], // `params` là một phần của key, khi nó thay đổi, query sẽ fetch lại
    queryFn: ({ signal }) => getOrdersApi(params, signal),
    placeholderData: undefined,
    refetchOnWindowFocus: false,
  });
};

export const useCheckCustomerExist = () => {
  const { showError } = useToast();
  return useMutation<CustomerCheckResponse, Error, string>({
    mutationFn: (phone: string) => getCheckExistCustomerPhone(phone),
    onError: (error) => {
      showError('Error checking customer: ' + error);
    },
  });
};
