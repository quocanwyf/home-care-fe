import { createHelperApi, getHelpersApi } from '@/apis/helpers.api';
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
