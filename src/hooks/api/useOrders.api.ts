import type { OrderParams } from '@/types/params/order-params';
import { useQuery } from '@tanstack/react-query';

import { ordersApi } from '../../apis/orders.api';

export const useOrders = (params: OrderParams) => {
  return useQuery({
    queryKey: ['orders', params], // `params` là một phần của key, khi nó thay đổi, query sẽ fetch lại
    queryFn: ({ signal }) => ordersApi(params, signal),
    placeholderData: undefined,
    refetchOnWindowFocus: false,
  });
};
