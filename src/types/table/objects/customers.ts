import type { Location } from './locations';

export type Customers = {
  phoneNumber: string;
  fullName: string;
  location: Location;
  point: number;
  status: CustomerWithStatus;
};
export type CustomerWithStatus = 'active' | 'inactive' | 'banned';

export interface Discount {
  _id: string;
  title: string;
  description: string;
  applyStartDate: string;
  applyEndDate: string;
  rate: number;
}
