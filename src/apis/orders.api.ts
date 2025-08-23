import type {
  AddOrderResponse,
  CustomerCheckResponse,
  DeleteOrderResponse,
  OrderAddInfoResponse,
  OrderDetailResponse,
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
    const error = await response.json();
    throw new Error(error.message);
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
  const url = `${import.meta.env.VITE_API_BASE_URL}/admin/requests/create`;

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

export const deleteOrderApi = async (
  requestId: string,
  signal?: AbortSignal
): Promise<DeleteOrderResponse> => {
  const url = `${import.meta.env.VITE_API_BASE_URL}/admin/requests/cancelAll/${requestId}`;

  try {
    const response = await fetch(url, {
      method: 'PATCH', // ✅ Using PATCH as specified
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      signal,
    });

    if (!response.ok) {
      // Handle different error status codes
      if (response.status === 404) {
        throw new Error('Request not found');
      } else if (response.status >= 500) {
        throw new Error('An error occurred while fetching requests');
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Request cancelled fail!');
      }
    }

    const data: DeleteOrderResponse = await response.json();
    return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error deleting order:', error);

    // Re-throw với message phù hợp
    if (error.name === 'AbortError') {
      throw new Error('Request was cancelled');
    }

    throw error;
  }
};

//order detail get
export const getOrderDetailApi = async (
  requestId: string,
  signal?: AbortSignal
): Promise<OrderDetailResponse> => {
  const url = `${import.meta.env.VITE_API_BASE_URL}/admin/requests/detail/${requestId}`;

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
      // Handle specific error cases
      if (response.status === 404) {
        throw new Error('Order not found!');
      } else if (response.status >= 500) {
        throw new Error('Server error');
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch order details');
      }
    }

    const data: OrderDetailResponse = await response.json();

    // Validate response structure
    if (!data.success) {
      throw new Error('Order not found!');
    }

    return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error fetching order detail:', error);

    // Re-throw with appropriate message
    if (error.name === 'AbortError') {
      throw new Error('Request was cancelled');
    }

    // If it's already our custom error message, keep it
    if (
      error.message === 'Order not found!' ||
      error.message === 'Server error'
    ) {
      throw error;
    }

    // Default to server error for unknown issues
    throw new Error('Server error');
  }
};

export const cancelOrderDetailApi = async (
  requestDetailId: string,
  signal?: AbortSignal
): Promise<{ success: boolean; message: string }> => {
  const url = `${import.meta.env.VITE_API_BASE_URL}/admin/requests/cancelDetail/${requestDetailId}`;

  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      signal,
    });

    if (!response.ok) {
      // Handle different error status codes
      if (response.status === 404) {
        throw new Error('Request detail not found');
      } else if (response.status === 400) {
        throw new Error('Cannot cancel this request detail');
      } else if (response.status >= 500) {
        throw new Error('Server error occurred');
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to cancel request detail');
      }
    }

    const data = await response.json();
    return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error canceling order detail:', error);

    // Re-throw with appropriate message
    if (error.name === 'AbortError') {
      throw new Error('Request was cancelled');
    }

    throw error;
  }
};

export const changeRequestDetailStatusApi = async (
  detailId: string,
  status: 'inProgress' | 'completed',
  signal?: AbortSignal
): Promise<{ success: boolean; message: string }> => {
  const url = `${import.meta.env.VITE_API_BASE_URL}/admin/requests/changeStatus/${detailId}?status=${status}&type=requestDetail`;

  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      signal,
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Request detail not found');
      } else if (response.status === 400) {
        throw new Error('Cannot change status of this request detail');
      } else if (response.status >= 500) {
        throw new Error('An error occurred while fetching requests');
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || 'Failed to change request detail status'
        );
      }
    }

    const data = await response.json();
    return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error changing request detail status:', error);

    if (error.name === 'AbortError') {
      throw new Error('Request was cancelled');
    }

    throw error;
  }
};

export const changeRequestStatusApi = async (
  requestId: string,
  status: 'completed',
  signal?: AbortSignal
): Promise<{ success: boolean; message: string }> => {
  const url = `${import.meta.env.VITE_API_BASE_URL}/admin/requests/changeStatus/${requestId}?status=${status}&type=request`;

  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      signal,
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Request not found');
      } else if (response.status === 400) {
        throw new Error('Cannot change status of this request');
      } else if (response.status >= 500) {
        throw new Error('An error occurred while processing payment');
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to process payment');
      }
    }

    const data = await response.json();
    return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error changing request status:', error);

    if (error.name === 'AbortError') {
      throw new Error('Request was cancelled');
    }

    throw error;
  }
};
