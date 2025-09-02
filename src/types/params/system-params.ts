export interface SystemConfig {
  baseSalary: number;
  openHour: string;
  closeHour: string;
  officeStartTime: string;
  officeEndTime: string;
  companyName: string;
  companyEmail: string;
  companyAddress: string;
  companyPhone: string;
}

export interface SystemResponse {
  success: boolean;
  message: string;
  generalSetting: SystemConfig;
}

export interface UpdateSystemResponse {
  success: boolean;
  message: string;
  data?: SystemConfig;
}
