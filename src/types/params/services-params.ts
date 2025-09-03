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

export interface ServiceEditData {
  _id: string;
  title: string;
  basicPrice: number;
  coefficient_id: string;
  description: string;
  status: 'active' | 'inactive';
  coefficient: {
    title: string;
    description: string;
    value: number;
    deleted: boolean;
    status: 'active' | 'inactive';
    _id: string;
  };
}

export interface ServiceEditInfo {
  success: boolean;
  result: ServiceEditData;
}

export interface ServiceUpdatePayload {
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
    status: 'active' | 'inactive';
  };
}

export interface ServiceUpdateResponse {
  success: boolean;
  message?: string;
}
