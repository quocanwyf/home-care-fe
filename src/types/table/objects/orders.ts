export type Orders = {
  orderId: string;
  phoneNumberCustomers: string;
  serviceCategory: string;
  orderDate: string; // ISO format
  cost: number;
  status: OrdersWithStatus;
};
export type OrdersWithStatus = {
  status: 'pending' | 'confirmed' | 'inProgress' | 'completed' | 'cancelled';
};
