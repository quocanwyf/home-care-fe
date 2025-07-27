import { hrsApi } from '@/apis/hrs.api';
import type { HRParams } from '@/types/params/hr-params';
import { useQuery } from '@tanstack/react-query';

export const useHRs = (params: HRParams) => {
  return useQuery({
    queryKey: ['hrs', params],
    queryFn: ({ signal }) => hrsApi(params, signal),
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });
};
