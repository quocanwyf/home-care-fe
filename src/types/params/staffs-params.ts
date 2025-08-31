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
