export type Maids = {
  phoneNumber: string;
  fullName: string;
  address: string;
  dateOfBirth: string; // ISO format
};

export type MaidsWithStatus = {
  status: 'active' | 'inactive' | 'banned';
};
