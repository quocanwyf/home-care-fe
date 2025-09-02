import { getSystemConfigApi, updateSystemConfigApi } from '@/apis/system.api';
import type {
  SystemConfig,
  SystemResponse,
  UpdateSystemResponse,
} from '@/types/params/system-params';
import { useMutation, useQuery } from '@tanstack/react-query';

import { useToast } from '../common/useToast';

export const useGetSystemConfig = () => {
  return useQuery<SystemResponse, Error>({
    queryKey: ['system-config'],
    queryFn: ({ signal }) => getSystemConfigApi(signal),
    staleTime: 10 * 60 * 1000, // 10 minutes - stable data
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

export const useUpdateSystemConfig = () => {
  const { showError, showSuccess } = useToast();

  return useMutation<UpdateSystemResponse, Error, SystemConfig>({
    mutationFn: (systemData: SystemConfig) => updateSystemConfigApi(systemData),
    onSuccess: (data) => {
      if (data.success) {
        showSuccess(
          data.message || 'System configuration updated successfully'
        );
      } else {
        showError(data.message || 'Failed to update system configuration');
      }
    },
    onError: (error) => {
      showError('Error updating system config: ' + error.message);
    },
  });
};
