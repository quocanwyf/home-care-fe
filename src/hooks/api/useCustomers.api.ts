// hooks/api/useCustomers.api.ts
import {
  getCustomerDetailApi,
  getCustomerOrdersApi,
  getCustomersApi,
} from '@/apis/customers.api';
import type { CustomerParams } from '@/types/params/customer-params';
import { useQuery } from '@tanstack/react-query';

//getcustomersapi
export const useGetCustomers = (params: CustomerParams) => {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: ({ signal }) => getCustomersApi(params, signal),
    placeholderData: undefined,
    refetchOnWindowFocus: false,
  });
};

//checkCustomerExistApi ở orders hook
//useGetCustomerDetail
export const useGetCustomerDetail = (cusPhone: string) => {
  return useQuery({
    queryKey: ['customer-detail', cusPhone],
    queryFn: ({ signal }) => getCustomerDetailApi(cusPhone, signal),
    enabled: !!cusPhone,
    refetchOnWindowFocus: false,
  });
};

export const useGetCustomerOrders = (search: string) => {
  return useQuery({
    queryKey: ['customer-orders', search],
    queryFn: ({ signal }) => getCustomerOrdersApi(search, signal),
    enabled: !!search,
    refetchOnWindowFocus: false,
  });
};
