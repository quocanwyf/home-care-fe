import type { Location } from './locations';

export type HRs = {
  phoneNumber: string;
  fullName: string;
  dateOfBirth: string; // ISO format
  status: HRsWithStatus;
  location: Location;
};

export type HRsWithStatus = 'active' | 'inactive';
