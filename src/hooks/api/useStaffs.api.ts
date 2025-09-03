import {
  createStaffApi,
  getStaffCreateInfoApi,
  getStaffDetailApi,
  getStaffEditApi,
  getStaffsApi,
  updateStaffApi,
} from '@/apis/staffs.api';
import type {
  StaffCreateResponse,
  StaffParams,
  StaffUpdatePayload,
  StaffUpdateResponse,
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

export const useGetStaffEdit = (id: string) => {
  return useQuery({
    queryKey: ['staff-edit', id],
    queryFn: ({ signal }) => getStaffEditApi(id, signal),
    enabled: !!id, // Only run query if id exists
    refetchOnWindowFocus: false,
  });
};

export const useUpdateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation<StaffUpdateResponse, Error, StaffUpdatePayload>({
    mutationFn: ({ id, formData }) => updateStaffApi(id, formData),
    onSuccess: () => {
      // Invalidate staffs list and staff edit data
      queryClient.invalidateQueries({ queryKey: ['staffs'] });
      queryClient.invalidateQueries({ queryKey: ['staff-edit'] });
    },
  });
};

export const useGetStaffDetail = (id: string) => {
  return useQuery({
    queryKey: ['staff-detail', id],
    queryFn: ({ signal }) => getStaffDetailApi(id, signal),
    enabled: !!id, // Only run query if id exists
    refetchOnWindowFocus: false,
  });
};
