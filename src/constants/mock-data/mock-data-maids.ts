import type { Maids } from '@/types/table/objects/maids';

export const data: Maids[] = [
  {
    phoneNumber: '0123791242',
    fullName: 'Le duc tho',
    location: {
      addressNum: '123 Le Loi',
      ward: 'Ben Nghe',
      city: 'Ho Chi Minh City',
    },
    dateOfBirth: '11/08/2004',
    status: 'active',
  },
  {
    phoneNumber: '0123791243',
    fullName: 'Nguyen Van A',
    location: {
      addressNum: '456 Nguyen Trai',
      ward: 'Ben Thanh',
      city: 'Ho Chi Minh City',
    },
    dateOfBirth: '11/08/2004',
    status: 'inactive',
  },
  {
    phoneNumber: '0123791244',
    fullName: 'Nguyen Van B',
    location: {
      addressNum: '789 Le Lai',
      ward: 'Pham Ngu Lao',
      city: 'Ho Chi Minh City',
    },
    dateOfBirth: '11/08/2004',
    status: 'inactive',
  },
];
