import {
  createServiceApi,
  deleteServiceApi,
  getServiceDetailApi,
  getServiceEditApi,
  getServicesApi,
  updateServiceApi,
} from '@/apis/services.api';
import type {
  ServiceCreatePayload,
  ServiceCreateResponse,
  ServiceParams,
  ServiceUpdatePayload,
  ServiceUpdateResponse,
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

export const useGetServiceEdit = (serviceId: string) => {
  return useQuery({
    queryKey: ['service-edit', serviceId],
    queryFn: ({ signal }) => getServiceEditApi(serviceId, signal),
    enabled: !!serviceId,
    refetchOnWindowFocus: false,
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ServiceUpdateResponse,
    Error,
    { id: string; payload: ServiceUpdatePayload }
  >({
    mutationFn: ({ id, payload }) => updateServiceApi(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['service-edit'] });
    },
  });
};

export const useGetServiceDetail = (serviceId: string) => {
  return useQuery({
    queryKey: ['service-detail', serviceId],
    queryFn: ({ signal }) => getServiceDetailApi(serviceId, signal),
    enabled: !!serviceId,
    refetchOnWindowFocus: false,
  });
};
