export type Customer = {
  phoneNumber: string;
  fullName: string;
  address: string;
  points: number;
};
export type CustomerWithStatus = Customer & {
  status: 'active' | 'inactive' | 'banned';
};
