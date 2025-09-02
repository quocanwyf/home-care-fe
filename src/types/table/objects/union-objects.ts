export type ObjectsUnion = {
  orderId?: string;
  phoneNumberCustomers?: string;
  addressCustomers?: string;
  serviceCategory?: string;
  orderDate?: string;
  cost?: number;
  phoneNumber?: string;
  fullName?: string;
  address?: string;
  dateOfBirth?: string;
  points?: number;
  status?: ObjectsWithStatus;
};

export type ObjectsWithStatus =
  | 'pending'
  | 'confirmed'
  | 'inProgress'
  | 'waitPayment'
  | 'completed'
  | 'cancelled'
  | 'assigned'
  | 'active'
  | 'inactive'
  | 'online'
  | 'offline'
  | 'working'
  | 'banned';

export const ObjectsStatusStyles: Record<ObjectsWithStatus, string> = {
  pending: 'bg-sky-100 text-sky-800',
  confirmed: 'bg-blue-100 text-blue-800',
  inProgress: 'bg-green-100 text-green-800',
  waitPayment: 'bg-orange-100 text-orange-800',
  completed: 'bg-purple-100 text-purple-800',
  cancelled: 'bg-red-100 text-red-800',
  assigned: 'bg-fuchsia-100 text-fuchsia-800',
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  online: 'bg-green-100 text-green-800',
  offline: 'bg-gray-100 text-gray-800',
  working: 'bg-blue-100 text-blue-800',
  banned: 'bg-red-100 text-red-800',
};
