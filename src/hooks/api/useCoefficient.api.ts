import {
  createCoefficientApi,
  getCoefficientDetailApi,
  getCoefficientListApi,
  updateCoefficientApi,
} from '@/apis/coefficient.api';
import type { CoefficientListParams } from '@/types/params/coefficient-params';
import type {
  CreateCoefficientRequest,
  UpdateCostFactorRequest,
} from '@/types/table/objects/coefficient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetCoefficientList = (params: CoefficientListParams) => {
  return useQuery({
    queryKey: ['coefficient-list', params],
    queryFn: ({ signal }) => getCoefficientListApi(params, signal),
    placeholderData: undefined,
    refetchOnWindowFocus: false,
  });
};

export const useGetCoefficientDetail = (id: string) => {
  return useQuery({
    queryKey: ['coefficient-detail', id],
    queryFn: ({ signal }) => getCoefficientDetailApi(id, signal),
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};

export const useCreateCoefficient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCoefficientRequest) => createCoefficientApi(data),
    onSuccess: () => {
      // Invalidate coefficient list queries
      queryClient.invalidateQueries({
        queryKey: ['coefficient-list'],
      });
    },
  });
};

export const useUpdateCoefficient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCostFactorRequest }) =>
      updateCoefficientApi(id, data),
    onSuccess: (_, { id }) => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: ['coefficient-list'],
      });
      queryClient.invalidateQueries({
        queryKey: ['coefficient-detail', id],
      });
    },
  });
};
