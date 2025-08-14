import {
  getDistrictsApi,
  getProvincesApi,
  getWardsApi,
} from '@/apis/locations.api';
import type {
  DistrictResponse,
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

export const useGetDistricts = (provinceCode: string, search?: string) => {
  return useQuery<DistrictResponse, Error>({
    queryKey: ['districts', provinceCode, search],
    queryFn: ({ signal }) => getDistrictsApi(provinceCode, search, signal),
    enabled: !!provinceCode, // Only run when provinceCode exists
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useGetWards = (
  provinceCode: string,
  districtCode: string,
  search?: string
) => {
  return useQuery<WardResponse, Error>({
    queryKey: ['wards', provinceCode, districtCode, search],
    queryFn: ({ signal }) =>
      getWardsApi(provinceCode, districtCode, search, signal),
    enabled: !!provinceCode && !!districtCode, // Only run when provinceCode and districtCode exist
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
