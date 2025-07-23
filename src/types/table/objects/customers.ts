export type Customers = {
  phoneNumber: string;
  fullName: string;
  address: string;
  point: number;
  status: CustomerWithStatus;
};
export type CustomerWithStatus = {
  status: 'active' | 'inactive' | 'banned';
};
