import { getStaffsApi } from '@/apis/staffs.api';
import type { StaffParams } from '@/types/params/staffs-params';
import { useQuery } from '@tanstack/react-query';

export const useGetStaffs = (params: StaffParams) => {
  return useQuery({
    queryKey: ['staffs', params],
    queryFn: ({ signal }) => getStaffsApi(params, signal),
    placeholderData: undefined,
    refetchOnWindowFocus: false,
  });
};
