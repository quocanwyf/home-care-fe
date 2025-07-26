import type { OrderParams } from '@/types/params/order-params';
import type { Orders } from '@/types/table/objects/orders';

export const ordersApi = async (
  params: OrderParams,
  signal?: AbortSignal
): Promise<Orders[]> => {
  const queryParams = new URLSearchParams();

  // Nếu status khác 'all' thì mới gửi
  if (params.status && params.status !== 'all') {
    queryParams.append('status', params.status);
  }

  // Nếu có search
  if (params.search && params.search.trim() !== '') {
    queryParams.append('search', params.search.trim());
  }

  // Nếu fromDate và toDate đều có thì mới gửi (tránh lọc sai lệch)
  if (params.fromDate && params.toDate) {
    queryParams.append('fromDate', params.fromDate);
    queryParams.append('toDate', params.toDate);
  }

  // Luôn gửi page và limit (có default fallback)
  queryParams.append('page', String(params.page ?? 0));
  queryParams.append('limit', String(params.limit ?? 10));

  const url = `${import.meta.env.VITE_API_BASE_URL}/admin/order?${queryParams.toString()}`;

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
