import type {
  StaffCreateInfo,
  StaffCreateResponse,
  StaffParams,
  StaffsResponse,
} from '@/types/params/staffs-params';

export const getStaffsApi = async (
  params: StaffParams,
  signal?: AbortSignal
): Promise<StaffsResponse> => {
  const queryParams = new URLSearchParams();

  // Status filter (nếu có)
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

  const url = `${import.meta.env.VITE_API_BASE_URL}/admin/staffs?${queryParams.toString()}`;

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

  const data: StaffsResponse = await response.json();
  return data;
};

export const getStaffCreateInfoApi = async (
  signal?: AbortSignal
): Promise<StaffCreateInfo> => {
  const url = `${import.meta.env.VITE_API_BASE_URL}/admin/staffs/create`;

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

  const data: StaffCreateInfo = await response.json();
  return data;
};

// Create staff
export const createStaffApi = async (
  payload: FormData
): Promise<StaffCreateResponse> => {
  const url = `${import.meta.env.VITE_API_BASE_URL}/admin/staffs/create`;

  const response = await fetch(url, {
    method: 'POST',
    body: payload, // FormData, don't set Content-Type header
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: StaffCreateResponse = await response.json();
  return data;
};
