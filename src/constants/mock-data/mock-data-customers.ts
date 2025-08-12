import type { Customers } from '@/types/table/objects/customers';

export const data: Customers[] = [
  {
    phoneNumber: '0123791242',
    fullName: 'Le duc tho',
    location: {
      addressNum: '1234',
      ward: 'Ward 1',
      city: 'Ho Chi Minh City',
    },
    point: 314414141,
    status: 'active',
  },
  {
    phoneNumber: '0123791243',
    fullName: 'Nguyen Van A',
    location: {
      addressNum: '5678',
      ward: 'Ward 2',
      city: 'Hanoi',
    },
    point: 314141441,
    status: 'inactive',
  },
  {
    phoneNumber: '0123791244',
    fullName: 'Nguyen Van B',
    location: {
      addressNum: '91011',
      ward: 'Ward 3',
      city: 'Da Nang',
    },
    point: 141414141,
    status: 'banned',
  },
];
