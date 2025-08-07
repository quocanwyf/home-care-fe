export interface Location {
  addressNum: string;
  ward: string;
  city: string;
}

export interface Province {
  provinceCode: string;
  provinceFullName: string;
  provinceName: string;
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
export type WardResponse = LocationResponse<Ward>;
