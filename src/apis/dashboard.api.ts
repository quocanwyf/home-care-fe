import type {
  ChartParams,
  DashboardChartResponse,
  DashboardParams,
  DashboardStatsResponse,
} from '@/types/params/dashboard-params';

export const getDashboardStatsApi = async (
  params: DashboardParams,
  signal?: AbortSignal
): Promise<DashboardStatsResponse> => {
  const queryParams = new URLSearchParams();

  // Add date parameters
  queryParams.append('startDate', params.startDate);
  queryParams.append('endDate', params.endDate);

  const url = `${import.meta.env.VITE_API_BASE_URL}/admin/dashboard?${queryParams.toString()}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    signal,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: DashboardStatsResponse = await response.json();
  return data;
};

export const getDashboardChartApi = async (
  params: ChartParams,
  signal?: AbortSignal
): Promise<DashboardChartResponse> => {
  const queryParams = new URLSearchParams();

  // Add all parameters
  queryParams.append('startDate', params.startDate);
  queryParams.append('endDate', params.endDate);
  queryParams.append('interval', params.interval);
  console.log('dcmmmmmmmmmmmm', params);

  const url = `${import.meta.env.VITE_API_BASE_URL}/admin/dashboard/chart?${queryParams.toString()}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    signal,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: DashboardChartResponse = await response.json();
  return data;
};
