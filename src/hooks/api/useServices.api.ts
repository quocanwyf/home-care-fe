import {
  createServiceApi,
  deleteServiceApi,
  getServicesApi,
} from '@/apis/services.api';
import type {
  ServiceCreatePayload,
  ServiceCreateResponse,
  ServiceParams,
} from '@/types/params/services-params';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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

export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation<ServiceCreateResponse, Error, ServiceCreatePayload>({
    mutationFn: createServiceApi,
    onSuccess: () => {
      // Invalidate services list to refresh data
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
};
