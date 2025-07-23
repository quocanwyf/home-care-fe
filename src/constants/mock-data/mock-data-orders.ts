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
  {
    orderId: 'ORD123457',
    phoneNumberCustomers: '0987654321',
    serviceCategory: 'Plumbing',
    orderDate: '2023-10-02T11:00:00Z',
    cost: 750000,
    status: {
      status: 'confirmed',
    },
  },
  {
    orderId: 'ORD123458',
    phoneNumberCustomers: '0123456789',
    serviceCategory: 'Electrical',
    orderDate: '2023-10-03T12:00:00Z',
    cost: 600000,
    status: {
      status: 'inProgress',
    },
  },
  {
    orderId: 'ORD123459',
    phoneNumberCustomers: '0987654321',
    serviceCategory: 'Gardening',
    orderDate: '2023-10-04T13:00:00Z',
    cost: 400000,
    status: {
      status: 'completed',
    },
  },
  {
    orderId: 'ORD123460',
    phoneNumberCustomers: '0123456789',
    serviceCategory: 'Carpentry',
    orderDate: '2023-10-05T14:00:00Z',
    cost: 300000,
    status: {
      status: 'cancelled',
    },
  },
  {
    orderId: 'ORD123461',
    phoneNumberCustomers: '0987654321',
    serviceCategory: 'Painting',
    orderDate: '2023-10-06T15:00:00Z',
    cost: 450000,
    status: {
      status: 'pending',
    },
  },
  {
    orderId: 'ORD123462',
    phoneNumberCustomers: '0123456789',
    serviceCategory: 'Cleaning',
    orderDate: '2023-10-07T16:00:00Z',
    cost: 550000,
    status: {
      status: 'confirmed',
    },
  },
  {
    orderId: 'ORD123463',
    phoneNumberCustomers: '0987654321',
    serviceCategory: 'Plumbing',
    orderDate: '2023-10-08T17:00:00Z',
    cost: 750000,
    status: {
      status: 'inProgress',
    },
  },
  {
    orderId: 'ORD123464',
    phoneNumberCustomers: '0123456789',
    serviceCategory: 'Electrical',
    orderDate: '2023-10-09T18:00:00Z',
    cost: 600000,
    status: {
      status: 'completed',
    },
  },
  {
    orderId: 'ORD123465',
    phoneNumberCustomers: '0987654321',
    serviceCategory: 'Gardening',
    orderDate: '2023-10-10T19:00:00Z',
    cost: 400000,
    status: {
      status: 'cancelled',
    },
  },
  {
    orderId: 'ORD123466',
    phoneNumberCustomers: '0123456789',
    serviceCategory: 'Carpentry',
    orderDate: '2023-10-11T20:00:00Z',
    cost: 300000,
    status: {
      status: 'pending',
    },
  },
  {
    orderId: 'ORD123467',
    phoneNumberCustomers: '0987654321',
    serviceCategory: 'Painting',
    orderDate: '2023-10-12T21:00:00Z',
    cost: 450000,
    status: {
      status: 'confirmed',
    },
  },
];
