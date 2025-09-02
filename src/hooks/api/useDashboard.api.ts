import {
  getDashboardChartApi,
  getDashboardStatsApi,
} from '@/apis/dashboard.api';
import type {
  ChartParams,
  DashboardParams,
} from '@/types/params/dashboard-params';
import { useQuery } from '@tanstack/react-query';

export const useGetDashboardStats = (params: DashboardParams) => {
  return useQuery({
    queryKey: ['dashboard-stats', params],
    queryFn: ({ signal }) => getDashboardStatsApi(params, signal),
    placeholderData: undefined,
    refetchOnWindowFocus: false,
    enabled: !!(params.startDate && params.endDate), // Only run if dates are provided
  });
};

export const useGetDashboardChart = (params: ChartParams) => {
  return useQuery({
    queryKey: ['dashboard-chart', params],
    queryFn: ({ signal }) => getDashboardChartApi(params, signal),
    placeholderData: undefined,
    refetchOnWindowFocus: false,
    enabled: !!(params.startDate && params.endDate && params.interval), // Only run if all params provided
  });
};
