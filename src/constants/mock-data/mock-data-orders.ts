import type { Orders } from '@/types/table/objects/orders';

export const data: Orders[] = [
  {
    orderId: 'ORD123456',
    phoneNumberCustomers: '0123456789',
    serviceCategory: 'Cleaning',
    orderDate: '2023-10-01T10:00:00Z',
    cost: 500000,
    status: {
      status: 'pending',
    },
  },
];
