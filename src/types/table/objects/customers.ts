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
  rate: number;
  title: string;
  description: string;
  applyEndDate: string;
  applyStartDate: string;
}
