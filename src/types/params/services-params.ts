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

export interface ServiceCreatePayload {
  service: {
    title: string;
    basicPrice: number;
    description: string;
    status: 'active' | 'inactive';
  };
  coefficient: {
    title: string;
    description: string;
    value: number;
  };
}

export interface ServiceCreateResponse {
  success: boolean;
  message?: string;
}
