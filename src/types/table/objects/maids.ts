import type { HRLocation } from './hrs';

export type Maids = {
  phoneNumber: string;
  fullName: string;
  location: HRLocation;
  dateOfBirth: string; // ISO format
  status: MaidsWithStatus;
};

export type MaidsWithStatus = 'active' | 'inactive';
