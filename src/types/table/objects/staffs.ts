import type { HRLocation } from './hrs';

export type Staffs = {
  phoneNumber: string;
  fullName: string;
  location: HRLocation;
  dateOfBirth: string; // ISO format
  status: StaffsWithStatus;
};

export type StaffsWithStatus = 'active' | 'inactive';
