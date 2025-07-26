export interface CustomerLocation {
  addressNum: string;
  ward: string;
  city: string;
}

export type Customers = {
  phoneNumber: string;
  fullName: string;
  location: CustomerLocation;
  point: number;
  status: CustomerWithStatus;
};
export type CustomerWithStatus = 'active' | 'inactive' | 'banned';
