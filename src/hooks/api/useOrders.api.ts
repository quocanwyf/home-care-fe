import { getOrdersApi } from '@/apis/orders.api';
import type { OrderParams } from '@/types/params/order-params';
import { useQuery } from '@tanstack/react-query';

export const useGetOrders = (params: OrderParams) => {
  return useQuery({
    queryKey: ['orders', params], // `params` là một phần của key, khi nó thay đổi, query sẽ fetch lại
    queryFn: ({ signal }) => getOrdersApi(params, signal),
    placeholderData: undefined,
    refetchOnWindowFocus: false,
  });
};
