import type {
  CustomerCheckResponse,
  OrderAddInfoResponse,
  OrderParams,
} from '@/types/params/order-params';
import type { Orders } from '@/types/table/objects/orders';

export const getOrdersApi = async (
  params: OrderParams,
  signal?: AbortSignal
): Promise<Orders[]> => {
  const queryParams = new URLSearchParams();

  // Nếu status khác all thì mới gửi
  if (params.status && params.status !== 'all') {
    queryParams.append('status', params.status);
  }

  // Nếu có search
  if (params.search && params.search.trim() !== '') {
    queryParams.append('search', params.search.trim());
  }

  // Nếu fromDate và toDate đều có thì mới gửi
  if (params.fromDate && params.toDate) {
    queryParams.append('fromDate', params.fromDate);
    queryParams.append('toDate', params.toDate);
  }

  // Luôn gửi page và limit
  queryParams.append('page', String(params.page ?? 0));
  queryParams.append('limit', String(params.limit ?? 10));

  // const url = `${import.meta.env.VITE_API_BASE_URL}/admin/order?${queryParams.toString()}`;
  const url = `${import.meta.env.VITE_API_BASE_URL}/admin/requests`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    signal,
  });

  if (!response.ok) {
    throw new Error(`Fetch failed: ${response.status}`);
  }

  const data: Orders[] = await response.json();
  return data;
};

export const getCheckExistCustomerPhone = async (
  phone: string,
  signal?: AbortSignal
): Promise<CustomerCheckResponse> => {
  const url = `${import.meta.env.VITE_API_BASE_URL}/admin/customer/checkExist/${phone}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    signal,
  });

  if (!response.ok) {
    throw new Error(`Customer check failed: ${response.status}`);
  }

  const data: CustomerCheckResponse = await response.json();
  return data;
};

//get add order info
export const getOrderAddInfoApi = async (
  signal?: AbortSignal
): Promise<OrderAddInfoResponse> => {
  const url = `${import.meta.env.VITE_API_BASE_URL}/admin/requests/create`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      signal,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch order info: ${response.status}`);
    }

    const data: OrderAddInfoResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching order add info:', error);
    throw new Error('Server error');
  }
};
