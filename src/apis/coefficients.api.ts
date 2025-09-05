import type {
  CoefficientCreatePayload,
  CoefficientCreateResponse,
  CoefficientListResponse,
  CoefficientParams,
  CoefficientUpdateResponse,
} from '@/types/params/coefficient-params';

export const getCoefficientListApi = async (
  params: CoefficientParams,
  signal?: AbortSignal
): Promise<CoefficientListResponse> => {
  const queryParams = new URLSearchParams();

  // Filter by applyTo
  if (params.applyTo) {
    queryParams.append('applyTo', params.applyTo);
  }

  // Search by ID or title
  if (params.search && params.search.trim() !== '') {
    queryParams.append('search', params.search.trim());
  }

  // Pagination - luôn gửi page và limit
  queryParams.append('page', String(params.page ?? 1));
  queryParams.append('limit', String(params.limit ?? 10));

  const url = `${import.meta.env.VITE_API_BASE_URL}/admin/costFactors?${queryParams.toString()}`;

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

  const data: CoefficientListResponse = await response.json();
  return data;
};

export const createCoefficientApi = async (
  payload: CoefficientCreatePayload
): Promise<CoefficientCreateResponse> => {
  const url = `${import.meta.env.VITE_API_BASE_URL}/admin/costFactors/create`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: CoefficientCreateResponse = await response.json();
  return data;
};

export const updateSingleCoefficientApi = async (
  parentId: string,
  coefficientData: {
    _id: string;
    title: string;
    description: string;
    value: number;
    status: 'active' | 'inactive';
  }
): Promise<CoefficientUpdateResponse> => {
  const url = `${import.meta.env.VITE_API_BASE_URL}/admin/costFactors/edit/${parentId}`;

  // Payload chỉ có 1 coefficient trong array
  const payload = {
    coefficientList: [coefficientData],
  };

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: CoefficientUpdateResponse = await response.json();
  return data;
};
