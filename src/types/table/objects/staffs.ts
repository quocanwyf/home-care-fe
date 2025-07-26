export type Staffs = {
  phoneNumber: string;
  fullName: string;
  address: string;
  dateOfBirth: string; // ISO format
  status: StaffsWithStatus;
};

export type StaffsWithStatus = 'active' | 'inactive';
