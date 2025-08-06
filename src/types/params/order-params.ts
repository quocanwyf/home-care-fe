export interface OrderParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  fromDate?: string | Date; // Định dạng DD-MM-YYYY
  toDate?: string | Date; // Định dạng DD-MM-YYYY
}

//order form add
export interface LocationData {
  addressNum: string;
  city: string;
  ward: string;
}

export interface CustomerFormData {
  phoneNumberCustomer: string;
  fullNameCustomer: string;
  location: LocationData;
}

export interface OrderFormData extends CustomerFormData {
  // Thêm các fields khác khi cần
  // serviceType?: string;
  // requestType?: string;
  // workDays?: {
  //   startDay: string;
  //   endDay: string;
  // };
}

export interface CustomerAreaProps {
  formData: CustomerFormData;
  onUpdateFormData: (newData: Partial<CustomerFormData>) => void;
  onSearchCustomer: (phoneNumber: string) => Promise<any>;
  isSearching?: boolean;
}
