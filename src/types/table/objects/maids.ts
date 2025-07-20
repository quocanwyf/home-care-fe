export type Maids = {
  phoneNumber: string;
  fullName: string;
  address: string;
  dateOfBirth: string; // ISO format
  status: MaidsWithStatus;
};

export type MaidsWithStatus = {
  status: 'active' | 'inactive';
};
