import type { CoefficientOther } from '../table/objects/coefficient';
import type { Discount } from '../table/objects/customers';
import type { Location } from '../table/objects/locations';
import type { ServiceCategory } from '../table/objects/services';
import type { SystemSetting } from '../table/objects/system-setting';

// get orders params
export interface OrderParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  fromDate?: string | Date; // Định dạng DD-MM-YYYY
  toDate?: string | Date; // Định dạng DD-MM-YYYY
}

export interface DetailCost {
  date: string; //"dd/mm/yyyy"
  cost: number; // cost for that date
}

//order form add data type
export interface OrderFormData {
  // Service information
  serviceTitle: string;
  serviceBasePrice: number;
  coefficient_service: number;
  coefficient_other: number;
  coefficient_ot: number;

  // Date and time
  startDate: string; // "dd/mm/yyyy"
  endDate: string; // "dd/mm/yyyy"
  startTime: string; // "hh:mm"
  endTime: string; // "hh:mm"

  // Cost calculation
  totalCost: number;
  detailCost: DetailCost[];

  // Customer information
  fullName: string;
  phone: string;
  address: string;

  // Location codes
  wardCode: string;
  districtCode: string;
  provinceCode: string;

  // Location names
  ward: string;
  district: string;
  province: string;

  // Account status
  isCusHasAcc: boolean;
}

//get customer exist phone params
export interface CustomerFormData {
  cusName: string;
  addresses: Location[];
}

export interface CustomerCheckResponse {
  success: boolean;
  customer: CustomerFormData;
  discountList: Discount[];
}

// customer area form data
export type CustomerAreaProps = {
  formData: OrderFormData;
  onUpdateFormData: (newData: Partial<OrderFormData>) => void;
  handleUpdateAvailableDiscounts?: (discounts: Discount[]) => void;
  serviceList?: ServiceCategory[];
  systemSetting?: SystemSetting;
  coefficientOther?: CoefficientOther[];
  onSetDataForCalculate?: (data: any) => void;
};

//order-add-info-get
export interface OrderAddInfoResponse {
  success: boolean;
  result: {
    serviceList: ServiceCategory[];
    systemSetting: SystemSetting;
    coefficientOrder: CoefficientOther[];
  };
}
