// apis/customers.api.ts
import type {
  CustomerParams,
  CustomersResponse,
} from '@/types/params/customer-params';

export const customersApi = async (
  params: CustomerParams,
  signal?: AbortSignal
): Promise<CustomersResponse> => {
  // ✅ Build query parameters
  const queryParams = new URLSearchParams();

  if (params.status) {
    queryParams.append('status', params.status);
  }

  if (params.search) {
    queryParams.append('search', params.search);
  }

  queryParams.append('page', String(params.page ?? 0));
  queryParams.append('limit', String(params.limit ?? 10));

  const url = `${import.meta.env.VITE_API_BASE_URL}/admin/customer${
    queryParams.toString() ? `?${queryParams.toString()}` : ''
  }`;

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

  const data: CustomersResponse = await response.json();

  return data;
};
