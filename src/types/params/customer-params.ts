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

export interface CustomerDetailData {
  _id: string;
  fullName: string;
  phone: string;
  points: number;
  addresses: {
    detailAddress: string;
    province: string;
    district: string;
    ward: string;
  };
}

export interface CustomerDetailInfo {
  success: boolean;
  customer: CustomerDetailData;
}

export interface CustomerOrderData {
  orderId: string;
  orderDate: string;
  status: string;
  phoneNumberCustomers: string;
  serviceCategory: string;
  cost: string;
}

export interface CustomerOrdersResponse {
  success: boolean;
  result: CustomerOrderData[];
  totalOrders: number;
}
