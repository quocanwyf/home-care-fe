import type { Maids } from '@/types/table/objects/maids';

export const data: Maids[] = [
  {
    phoneNumber: '0123791242',
    fullName: 'Le duc tho',
    address: 'q3 tphcm',
    dateOfBirth: '11/08/2004',
    status: { status: 'active' },
  },
  {
    phoneNumber: '0123791243',
    fullName: 'Nguyen Van A',
    address: 'q1 tphcm',
    dateOfBirth: '11/08/2004',
    status: { status: 'inactive' },
  },
  {
    phoneNumber: '0123791244',
    fullName: 'Nguyen Van B',
    address: 'q2 tphcm',
    dateOfBirth: '11/08/2004',
    status: { status: 'banned' },
  },
];
