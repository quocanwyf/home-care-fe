import type { HRParams, HRsResponse } from '@/types/params/hr-params';

export const getHrsApi = async (
  params: HRParams,
  signal?: AbortSignal
): Promise<HRsResponse> => {
  const queryParams = new URLSearchParams();

  // Type filter (staff hoặc helper, default helper)
  if (params.type) {
    queryParams.append('type', params.type);
  }

  // Status filter
  if (params.status && params.status !== 'all') {
    queryParams.append('status', params.status);
  }

  // Search by ID or phone
  if (params.search && params.search.trim() !== '') {
    queryParams.append('search', params.search.trim());
  }

  // Pagination - luôn gửi page và limit
  queryParams.append('page', String(params.page ?? 0));
  queryParams.append('limit', String(params.limit ?? 10));

  const url = `${import.meta.env.VITE_API_BASE_URL}/admin/humanResource?${queryParams.toString()}`;

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

  const data: HRsResponse = await response.json();

  return data;
};
