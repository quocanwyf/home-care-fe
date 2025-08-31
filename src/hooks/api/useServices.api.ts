import { getServicesApi } from '@/apis/services.api';
import type { ServiceParams } from '@/types/params/services-params';
import { useQuery } from '@tanstack/react-query';

export const useGetServices = (params: ServiceParams) => {
  return useQuery({
    queryKey: ['services', params],
    queryFn: ({ signal }) => getServicesApi(params, signal),
    placeholderData: undefined,
    refetchOnWindowFocus: false,
  });
};
