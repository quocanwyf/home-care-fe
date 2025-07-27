export interface HRLocation {
  addressNum: string;
  ward: string;
  city: string;
}

export type HRs = {
  phoneNumber: string;
  fullName: string;
  dateOfBirth: string; // ISO format
  status: HRsWithStatus;
  location: HRLocation;
};

export type HRsWithStatus = 'active' | 'inactive';
