export interface Helper {
  _id: string;
  helper_id: string;
  fullName: string;
  phone: string;
  avatar: string;
  workingStatus: string;
}

export interface HelperParams {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface HelpersResponse {
  success: boolean;
  helpers: Helper[]; // Thay đổi từ staffs thành helpers
  totalHRs?: number;
  totalPages?: number;
  currentPage?: number;
}
