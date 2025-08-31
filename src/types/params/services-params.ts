import type { Service } from '../table/objects/services';

export interface ServiceParams {
  search?: string;
  page?: number;
  limit?: number;
}

export interface ServicesResponse {
  success: boolean;
  totalServices: number;
  services: Service[];
}
