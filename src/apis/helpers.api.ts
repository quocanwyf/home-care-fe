import type {
  HelperParams,
  HelpersResponse,
} from '@/types/params/helpers-params';

export const getHelpersApi = async (
  params: HelperParams,
  signal?: AbortSignal
): Promise<HelpersResponse> => {
  const queryParams = new URLSearchParams();

  // Status filter
  if (params.status && params.status !== 'all') {
    queryParams.append('status', params.status);
  }

  // Search by ID or phone or name
  if (params.search && params.search.trim() !== '') {
    queryParams.append('search', params.search.trim());
  }

  // Pagination - luôn gửi page và limit
  queryParams.append('page', String(params.page ?? 0));
  queryParams.append('limit', String(params.limit ?? 10));

  const url = `${import.meta.env.VITE_API_BASE_URL}/admin/helpers?${queryParams.toString()}`;

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

  const data: HelpersResponse = await response.json();
  return data;
};
