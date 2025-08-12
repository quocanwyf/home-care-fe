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
  disId: string;
  title: string;
  desc: string;
  minCost: string;
  percentage: string;
}
