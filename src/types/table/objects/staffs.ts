export type Staffs = {
  phoneNumber: string;
  fullName: string;
  address: string;
  dateOfBirth: string; // ISO format
};

export type StaffsWithStatus = {
  status: 'active' | 'inactive' | 'banned';
};
