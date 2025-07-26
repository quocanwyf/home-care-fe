// hooks/api/useCustomers.api.ts
import { customersApi } from '@/apis/customers.api';
import type { CustomerParams } from '@/types/params/customer-params';
import { useQuery } from '@tanstack/react-query';

export const useCustomers = (params: CustomerParams) => {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: ({ signal }) => customersApi(params, signal),
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });
};
