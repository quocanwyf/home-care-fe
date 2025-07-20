export type Customers = {
  phoneNumber: string;
  fullName: string;
  address: string;
  points: number;
  status: CustomerWithStatus;
};
export type CustomerWithStatus = {
  status: 'active' | 'inactive' | 'banned';
};
