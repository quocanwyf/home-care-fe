// hooks/api/useCustomers.api.ts
import { getCustomersApi } from '@/apis/customers.api';
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

//checkCustomerExistApi
