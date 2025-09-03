export interface StaffFormData {
  staff_id: string;
  fullName: string;
  password: string;
  birthDate: string;
  phone: string;
  email: string;
  birthPlace: string;
  avatar: File[];
  salary: string; // Keep as string for input handling
  role: { label: string; value: string };
  status: { label: string; value: 'active' | 'inactive' };
}
