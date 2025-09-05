import {
  createCoefficientApi,
  getCoefficientListApi,
  updateSingleCoefficientApi,
} from '@/apis/coefficients.api';
import type {
  CoefficientCreatePayload,
  CoefficientCreateResponse,
  CoefficientParams,
  CoefficientUpdateResponse,
} from '@/types/params/coefficient-params';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetCoefficientList = (params: CoefficientParams) => {
  return useQuery({
    queryKey: ['coefficients', params],
    queryFn: ({ signal }) => getCoefficientListApi(params, signal),
    placeholderData: undefined,
    refetchOnWindowFocus: false,
  });
};

export const useCreateCoefficient = () => {
  const queryClient = useQueryClient();

  return useMutation<
    CoefficientCreateResponse,
    Error,
    CoefficientCreatePayload
  >({
    mutationFn: createCoefficientApi,
    onSuccess: () => {
      // Invalidate coefficients list to refresh data
      queryClient.invalidateQueries({ queryKey: ['coefficients'] });
    },
  });
};

export const useUpdateSingleCoefficient = () => {
  const queryClient = useQueryClient();

  return useMutation<
    CoefficientUpdateResponse,
    Error,
    {
      parentId: string;
      coefficientData: {
        _id: string;
        title: string;
        description: string;
        value: number;
        status: 'active' | 'inactive';
      };
    }
  >({
    mutationFn: ({ parentId, coefficientData }) =>
      updateSingleCoefficientApi(parentId, coefficientData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coefficients'] });
    },
  });
};
