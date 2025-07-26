export interface OrderParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  fromDate?: string | Date; // Định dạng DD-MM-YYYY
  toDate?: string | Date; // Định dạng DD-MM-YYYY
}
