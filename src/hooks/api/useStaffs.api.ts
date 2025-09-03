import {
  createStaffApi,
  getStaffCreateInfoApi,
  getStaffsApi,
} from '@/apis/staffs.api';
import type {
  StaffCreateResponse,
  StaffParams,
} from '@/types/params/staffs-params';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetStaffs = (params: StaffParams) => {
  return useQuery({
    queryKey: ['staffs', params],
    queryFn: ({ signal }) => getStaffsApi(params, signal),
    placeholderData: undefined,
    refetchOnWindowFocus: false,
  });
};

export const useGetStaffCreateInfo = () => {
  return useQuery({
    queryKey: ['staff-create-info'],
    queryFn: ({ signal }) => getStaffCreateInfoApi(signal),
    refetchOnWindowFocus: false,
  });
};

export const useCreateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation<StaffCreateResponse, Error, FormData>({
    mutationFn: createStaffApi,
    onSuccess: () => {
      // Invalidate staffs list to refresh data
      queryClient.invalidateQueries({ queryKey: ['staffs'] });
    },
  });
};
