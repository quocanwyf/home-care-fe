import type { Customers } from '@/types/table/objects/customers';

//get customers params
export interface CustomersResponse {
  success: boolean;
  result: Customers[];
  totalCustomers: number;
}

export interface CustomerParams {
  status?: string;
  search?: string; // Tìm theo số điện thoại
  page?: number;
  limit?: number;
}
