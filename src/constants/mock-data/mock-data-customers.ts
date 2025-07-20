import type { Customers } from '@/types/table/customers';

export const data: Customers[] = [
  {
    phoneNumber: '0123791242',
    fullName: 'Le duc tho',
    address: 'q3 tphcm',
    points: 314414141,
    status: { status: 'active' },
  },
  {
    phoneNumber: '0123791243',
    fullName: 'Nguyen Van A',
    address: '2222',
    points: 314141441,
    status: { status: 'inactive' },
  },
  {
    phoneNumber: '0123791244',
    fullName: 'Nguyen Van B',
    address: 'q2 tphcm',
    points: 3111313,
    status: { status: 'banned' },
  },
];
