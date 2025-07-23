import type { Customers } from '@/types/table/objects/customers';

export const data: Customers[] = [
  {
    phoneNumber: '0123791242',
    fullName: 'Le duc tho',
    address: 'q3 tphcm',
    point: 314414141,
    status: { status: 'active' },
  },
  {
    phoneNumber: '0123791243',
    fullName: 'Nguyen Van A',
    address: '2222',
    point: 314141441,
    status: { status: 'inactive' },
  },
  {
    phoneNumber: '0123791244',
    fullName: 'Nguyen Van B',
    address: 'q2 tphcm',
    point: 3111313,
    status: { status: 'banned' },
  },
];
