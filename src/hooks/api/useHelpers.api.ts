import {
  createHelperApi,
  getHelperDetailApi,
  getHelperEditApi,
  getHelpersApi,
  updateHelperApi,
} from '@/apis/helpers.api';
import type { HelperParams } from '@/types/params/helpers-params';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetHelpers = (params: HelperParams) => {
  return useQuery({
    queryKey: ['helpers', params],
    queryFn: ({ signal }) => getHelpersApi(params, signal),
    placeholderData: undefined,
    refetchOnWindowFocus: false,
  });
};

export const useCreateHelper = () => {
  return useMutation({
    mutationFn: (formData: FormData) => {
      return createHelperApi(formData);
    },
  });
};

export const useGetHelperEdit = (id: string) => {
  return useQuery({
    queryKey: ['helper-edit', id],
    queryFn: () => getHelperEditApi(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};

export const useUpdateHelper = () => {
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) => {
      return updateHelperApi(id, formData);
    },
  });
};

export const useGetHelperDetail = (id: string) => {
  return useQuery({
    queryKey: ['helper-detail', id],
    queryFn: () => getHelperDetailApi(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};
