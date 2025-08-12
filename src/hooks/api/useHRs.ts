import { getHrsApi } from '@/apis/hrs.api';
import type { HRParams } from '@/types/params/hr-params';
import { useQuery } from '@tanstack/react-query';

export const useGetHRs = (params: HRParams) => {
  return useQuery({
    queryKey: ['hrs', params],
    queryFn: ({ signal }) => getHrsApi(params, signal),
    placeholderData: undefined,
    refetchOnWindowFocus: false,
  });
};
