// apis/customers.api.ts
import type {
  CustomerParams,
  CustomersResponse,
} from '@/types/params/customer-params';

export const getCustomersApi = async (
  params: CustomerParams,
  signal?: AbortSignal
): Promise<CustomersResponse> => {
  const queryParams = new URLSearchParams();

  if (params.status && params.status !== 'all') {
    queryParams.append('status', params.status);
  }

  if (params.search && params.search.trim() !== '') {
    queryParams.append('search', params.search.trim());
  }

  queryParams.append('page', String(params.page ?? 0));
  queryParams.append('limit', String(params.limit ?? 10));

  // const url = `${import.meta.env.VITE_API_BASE_URL}/admin/customer?${queryParams.toString()}`;
  const url = `${import.meta.env.VITE_API_BASE_URL}/admin/customer`;

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

export const checkCustomerExistApi = async (
  cusPhone: string,
  signal?: AbortSignal
): Promise<CustomersResponse> => {
  const url = `${import.meta.env.VITE_API_BASE_URL}/admin/customer/checkExist/${cusPhone}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    signal,
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Customer not found');
    }
    throw new Error('Server error');
  }

  const data: CustomersResponse = await response.json();
  return data;
};
