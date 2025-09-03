import type { z } from 'zod';

import type { orderFormSchema } from '@/schema/order-form-schema';

export type OrderFormSchemaType = z.infer<typeof orderFormSchema>;

// Export default values for form initialization
export const defaultOrderFormValues: OrderFormSchemaType = {
  // Service information
  serviceTitle: '',
  serviceBasePrice: 0,
  coefficient_service: 0,
  coefficient_other: 1,
  coefficient_ot: 1,

  // Date and time
  startDate: '',
  endDate: '',
  startTime: '',
  endTime: '',
  requestType: 'shortTerm',

  // Cost calculation
  totalCost: 0,
  detailCost: [],

  // Customer information
  fullName: '',
  phone: '',
  address: '',

  // Location codes
  wardCode: '',
  districtCode: '',
  provinceCode: '',

  // Location names
  ward: '',
  district: '',
  province: '',

  // Account status
  isCusHasAcc: false,
};
