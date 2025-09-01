import type {
  ServiceParams,
  ServicesResponse,
} from '@/types/params/services-params';

export const getServicesApi = async (
  params: ServiceParams,
  signal?: AbortSignal
): Promise<ServicesResponse> => {
  const queryParams = new URLSearchParams();

  // Search by ID or name
  if (params.search && params.search.trim() !== '') {
    queryParams.append('search', params.search.trim());
  }

  // Pagination - luôn gửi page và limit
  queryParams.append('page', String(params.page ?? 0));
  queryParams.append('limit', String(params.limit ?? 10));

  const url = `${import.meta.env.VITE_API_BASE_URL}/admin/services?${queryParams.toString()}`;

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

  const data: ServicesResponse = await response.json();
  return data;
};

export const deleteServiceApi = async (
  serviceId: string
): Promise<{ success: boolean }> => {
  const url = `${import.meta.env.VITE_API_BASE_URL}/admin/services/delete/${serviceId}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
};
