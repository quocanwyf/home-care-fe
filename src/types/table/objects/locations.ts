export interface Location {
  addressNum: string;
  ward: string;
  district: string;
  city: string;
}

export interface Province {
  provinceId: string;
  provinceFullName: string;
  provinceName: string;
}

export interface District {
  districtCode: string;
  districtName: string;
  districtFullName: string;
}

export interface Ward {
  wardCode: string;
  wardName: string;
  wardFullName: string;
}

export interface LocationResponse<T> {
  success: boolean;
  result: T[];
}

export type ProvinceResponse = LocationResponse<Province>;
export type DistrictResponse = LocationResponse<District>;
export type WardResponse = LocationResponse<Ward>;
