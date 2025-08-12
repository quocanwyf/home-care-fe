import type { Location } from './locations';

export type Maids = {
  phoneNumber: string;
  fullName: string;
  location: Location;
  dateOfBirth: string; // ISO format
  status: MaidsWithStatus;
};

export type MaidsWithStatus = 'active' | 'inactive';
