import type {
  CustomerLocation,
  Customers,
} from '@/types/table/objects/customers';

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

// Check if customer exists response
export interface CustomerCheckResponse {
  cusId: string;
  fullName: string;
  phone: string;
  location: CustomerLocation;
}

export interface Discount {
  disId: string;
  title: string;
  desc: string;
  minCost: string;
  percentage: string;
}

export interface CheckCustomerResponse {
  success: boolean;
  customer: CustomerCheckResponse;
  discountList: Discount[];
}
