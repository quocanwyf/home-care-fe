import { getProvincesApi, getWardsApi } from '@/apis/locations.api';
import type {
  ProvinceResponse,
  WardResponse,
} from '@/types/table/objects/locations';
import { useQuery } from '@tanstack/react-query';

export const useGetProvinces = (search?: string) => {
  return useQuery<ProvinceResponse, Error>({
    queryKey: ['provinces', search],
    queryFn: ({ signal }) => getProvincesApi(search, signal),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useGetWards = (provinceCode: string, search?: string) => {
  return useQuery<WardResponse, Error>({
    queryKey: ['wards', provinceCode, search],
    queryFn: ({ signal }) => getWardsApi(provinceCode, search, signal),
    enabled: !!provinceCode, // Only run when provinceCode exists
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
