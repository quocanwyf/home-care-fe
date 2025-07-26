export interface OrderParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  fromDate?: string; // Định dạng DD-MM-YYYY
  toDate?: string; // Định dạng DD-MM-YYYY
}
