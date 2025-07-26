// types/customer/index.ts
export interface CustomerLocation {
  addressNum: string;
  ward: string;
  city: string;
}

export interface Customer {
  fullName: string;
  phoneNumber: string;
  point: string;
  status: string;
  location: CustomerLocation;
}

export interface CustomersResponse {
  success: boolean;
  result: Customer[];
  totalCustomers: number;
}

export interface CustomerParams {
  status?: string;
  search?: string; // Tìm theo số điện thoại
  page?: number;
  limit?: number;
}
