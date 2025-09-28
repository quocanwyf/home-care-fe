export type Orders = {
  orderId: string;
  phoneNumberCustomers: string;
  serviceCategory: string;
  orderDate: string; // ISO format
  cost: number;
  status: OrdersWithStatus;
};

export interface RequestDetail {
  detailId: string;
  workingDate: string;
  startTime: string;
  endTime: string;
  status: string;
  cost: number;
  helper_cost: number;
  helper: {
    _id: string;
    fullName: string;
    phone: string;
  };
}

export type OrdersWithStatus =
  | 'pending'
  | 'confirmed'
  | 'inProgress'
  | 'completed'
  | 'cancelled';

export interface OrderEvaluation {
  review: string;
  loseThings: boolean;
  breakThings: boolean;
}

export interface OrderComment {
  review: string;
  loseThings: boolean;
  breakThings: boolean;
}
