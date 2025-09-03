export interface Staff {
  _id: string;
  staff_id: string;
  fullName: string;
  phone: string;
  avatar: string;
  role_id: string;
  role: string;
}

export interface StaffParams {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface StaffsResponse {
  success: boolean;
  staffs: Staff[];
  totalHRs?: number;
  totalPages?: number;
  currentPage?: number;
}

export interface Role {
  _id: string;
  title: string;
}

export interface StaffCreateInfo {
  success: boolean;
  roles: Role[];
}

export interface StaffCreatePayload {
  staff_id: string;
  fullName: string;
  password: string;
  birthDate: string;
  phone: string;
  email: string;
  birthPlace: string;
  avatar: File;
  salary: number;
  role_id: string;
  status: string;
}

export interface StaffCreateResponse {
  success: boolean;
  message?: string;
}

export interface StaffEditData {
  _id: string;
  staff_id: string;
  fullName: string;
  password: string;
  birthDate: string;
  startDate: string;
  phone: string;
  email: string;
  birthPlace: string;
  avatar: string;
  salary: number;
  role_id: string;
  status: 'active' | 'inactive';
}

export interface StaffEditInfo {
  success: boolean;
  staff: StaffEditData;
  roles: Role[];
}

export interface StaffUpdateResponse {
  success: boolean;
  message?: string;
}

export interface StaffUpdatePayload {
  id: string;
  formData: FormData;
}
