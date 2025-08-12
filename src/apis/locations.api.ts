import { normalizeSearchTerm } from '@/helpers/normalize-search-term';
import type {
  ProvinceResponse,
  WardResponse,
} from '@/types/table/objects/locations';

export const getProvincesApi = async (
  search?: string,
  signal?: AbortSignal
): Promise<ProvinceResponse> => {
  const queryParams = new URLSearchParams();

  if (search && search.trim()) {
    queryParams.append('search', normalizeSearchTerm(search.trim()));
  }

  const url = `${import.meta.env.VITE_API_BASE_URL}/admin/location/province${
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
    throw new Error(`Fetch provinces failed: ${response.status}`);
  }

  const data: ProvinceResponse = await response.json();
  return data;
};

export const getWardsApi = async (
  provinceCode: string,
  search?: string,
  signal?: AbortSignal
): Promise<WardResponse> => {
  const queryParams = new URLSearchParams();

  if (search && search.trim()) {
    queryParams.append('search', normalizeSearchTerm(search.trim()));
  }

  const url = `${import.meta.env.VITE_API_BASE_URL}/admin/location/ward/${provinceCode}${
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
    throw new Error(`Fetch wards failed: ${response.status}`);
  }

  const data: WardResponse = await response.json();
  return data;
};
