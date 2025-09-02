import type { CoefficientListParams } from '@/types/params/coefficient-params';
import type {
  CostFactorDetailResponse,
  CostFactorsResponse,
  CreateCoefficientRequest,
  UpdateCostFactorRequest,
} from '@/types/table/objects/coefficient';

export const getCoefficientListApi = async (
  params: CoefficientListParams,
  signal?: AbortSignal
): Promise<CostFactorsResponse> => {
  const queryParams = new URLSearchParams();

  if (params.applyTo) queryParams.append('applyTo', params.applyTo);
  if (params.search) queryParams.append('search', params.search);
  if (params.page !== undefined)
    queryParams.append('page', params.page.toString());
  if (params.limit !== undefined)
    queryParams.append('limit', params.limit.toString());

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
    throw new Error('Failed to fetch coefficient list');
  }

  return response.json();
};

export const getCoefficientDetailApi = async (
  id: string,
  signal?: AbortSignal
): Promise<CostFactorDetailResponse> => {
  const url = `${import.meta.env.VITE_API_BASE_URL}/admin/costFactors/edit/${id}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    signal,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch coefficient detail');
  }

  return response.json();
};

export const createCoefficientApi = async (
  data: CreateCoefficientRequest,
  signal?: AbortSignal
): Promise<{ success: boolean }> => {
  const url = `${import.meta.env.VITE_API_BASE_URL}/admin/costFactors/create`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
    signal,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to create coefficient');
  }

  return response.json();
};

export const updateCoefficientApi = async (
  id: string,
  data: UpdateCostFactorRequest,
  signal?: AbortSignal
): Promise<{ success: boolean }> => {
  const url = `${import.meta.env.VITE_API_BASE_URL}/admin/costFactors/edit/${id}`;

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
    signal,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to update coefficient');
  }

  return response.json();
};
