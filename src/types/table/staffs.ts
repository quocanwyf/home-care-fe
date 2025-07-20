export type Staffs = {
  identifier: string;
  fullName: string;
  dateOfBirth: string; // ISO format
  address: string;
};

export type StaffsWithStatus = Staffs & {
  status: 'active' | 'inactive' | 'banned';
};
