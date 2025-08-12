import { checkAuthApi } from '@/apis/checkAuth.api';
import { useQuery } from '@tanstack/react-query';

export const useAuthCheck = () => {
  return useQuery({
    queryKey: ['auth', 'validate'],
    queryFn: checkAuthApi,
    retry: false, // Không retry khi 401
    refetchOnWindowFocus: false, // Không auto refetch
    staleTime: 5 * 60 * 1000,
  });
};
