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
export const OrdersStatusStyles: Record<OrdersWithStatus['status'], string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  assigned: 'bg-blue-100 text-blue-800',
  inProgress: 'bg-green-100 text-green-800',
  waitPayment: 'bg-orange-100 text-orange-800',
  completed: 'bg-purple-100 text-purple-800',
  cancelled: 'bg-red-100 text-red-800',
};
