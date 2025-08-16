import type {
  AddOrderResponse,
  CustomerCheckResponse,
  OrderAddInfoResponse,
  OrderFormData,
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

  const url = `${import.meta.env.VITE_API_BASE_URL}/admin/requests?${queryParams.toString()}`;
  // const url = `${import.meta.env.VITE_API_BASE_URL}/admin/requests`;

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

export const addOrderApi = async (
  orderData: OrderFormData,
  signal?: AbortSignal
): Promise<AddOrderResponse> => {
  const url = `${import.meta.env.VITE_API_BASE_URL}/admin/order/add`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(orderData),
      signal,
    });

    if (!response.ok) {
      throw new Error(`Failed to add order: ${response.status}`);
    }

    const data: AddOrderResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding order:', error);
    throw new Error('Server error');
  }
};
