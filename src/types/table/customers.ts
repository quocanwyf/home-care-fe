export type Customer = {
  phone: string;
  fullName: string;
  address: string;
  points: number;
};
export type CustomerWithStatus = Customer & {
  status: 'active' | 'inactive' | 'banned';
};
