import type { Discount } from '../table/objects/customers';
import type { Location } from '../table/objects/locations';

// get orders params
export interface OrderParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  fromDate?: string | Date; // Định dạng DD-MM-YYYY
  toDate?: string | Date; // Định dạng DD-MM-YYYY
}

//order form add data type
export interface OrderFormData {
  phoneNumberCustomer: string;
  fullNameCustomer: string;
  location: {
    addressNum: string;
    city: string;
    ward: string;
  };
  serviceType?: string;
  requestType?: string;
  workDays?: {
    startDay: string;
    endDay: string;
  };
  workTime?: {
    startTime: string;
    endTime: string;
  };
  paymentType?: string;
  totalHelperCost?: string;
  totalOrderCost?: string;
  helperId?: string;
  discounts?: Discount[];
}

//get customer exist phone params
export interface CustomerFormData {
  cusId: string;
  fullName: string;
  phone: string;
  location: Location;
}

export interface CustomerCheckResponse {
  success: boolean;
  customer: CustomerFormData;
  discountList: Discount[];
}

// customer area form data
export type CustomerAreaProps = {
  formData: {
    phoneNumberCustomer: string;
    fullNameCustomer: string;
    location: {
      addressNum: string;
      city: string;
      ward: string;
    };
  };
  onUpdateFormData: (newData: Partial<OrderFormData>) => void;
};
