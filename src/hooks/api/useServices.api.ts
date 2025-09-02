import { deleteServiceApi, getServicesApi } from '@/apis/services.api';
import type { ServiceParams } from '@/types/params/services-params';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetServices = (params: ServiceParams) => {
  return useQuery({
    queryKey: ['services', params],
    queryFn: ({ signal }) => getServicesApi(params, signal),
    placeholderData: undefined,
    refetchOnWindowFocus: false,
  });
};

export const useDeleteService = () => {
  return useMutation({
    mutationFn: deleteServiceApi,
  });
};
