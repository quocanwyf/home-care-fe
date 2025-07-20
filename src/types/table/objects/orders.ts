export type Orders = {
  phoneNumberCustomers: string;
  addressCustomers: string;
  serviceCategory: string;
  orderDate: string; // ISO format
  cost: number;
  status: OrdersWithStatus;
};
export type OrdersWithStatus = {
  status:
    | 'pending'
    | 'assigned'
    | 'inProgress'
    | 'waitPayment'
    | 'completed'
    | 'cancelled';
};
