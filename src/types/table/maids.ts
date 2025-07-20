export type Maids = {
  phoneNumber: string;
  fullName: string;
  dateOfBirth: string; // ISO format
  address: string;
};

export type MaidsWithStatus = Maids & {
  status: 'active' | 'inactive' | 'banned';
};
