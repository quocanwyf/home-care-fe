import { getHelpersApi } from '@/apis/helpers.api';
import type { HelperParams } from '@/types/params/helpers-params';
import { useQuery } from '@tanstack/react-query';

export const useGetHelpers = (params: HelperParams) => {
  return useQuery({
    queryKey: ['helpers', params],
    queryFn: ({ signal }) => getHelpersApi(params, signal),
    placeholderData: undefined,
    refetchOnWindowFocus: false,
  });
};
