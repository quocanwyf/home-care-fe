import type { HRs } from '../table/objects/hrs';

export interface HRsResponse {
  success: boolean;
  result: HRs[];
  totalHRs: number;
}

export interface HRParams {
  status?: string;
  search?: string; // Tìm theo số điện thoại và ID
  page?: number;
  limit?: number;
  type?: 'staff' | 'helper'; // Loại nhân sự, mặc định là helper
}
