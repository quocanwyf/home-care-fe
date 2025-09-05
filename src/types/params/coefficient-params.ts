import type { CostFactorList } from '../table/objects/coefficient';

export interface CoefficientParams {
  applyTo?: 'service' | 'helper' | 'other';
  search?: string;
  page?: number;
  limit?: number;
}

export interface CoefficientListResponse {
  success: boolean;
  totalCostFactors: number;
  costFactorLists: CostFactorList[];
}

export interface CoefficientCreatePayload {
  title: string;
  description: string;
  value: number;
  status: 'active' | 'inactive';
}

export interface CoefficientCreateResponse {
  success: boolean;
  message?: string;
}

export interface CoefficientEditData {
  _id: string;
  title: string;
  description: string;
  applyTo: 'service' | 'helper' | 'other';
  status: 'active' | 'inactive';
  coefficientList: {
    title: string;
    description: string;
    value: number;
    deleted: boolean;
    status: 'active' | 'inactive';
    _id: string;
  }[];
}

export interface CoefficientEditInfo {
  success: boolean;
  result: CoefficientEditData;
}

export interface CoefficientUpdatePayload {
  title: string;
  description: string;
  status: 'active' | 'inactive';
  coefficientList: {
    _id: string;
    title: string;
    description: string;
    value: number;
    status: 'active' | 'inactive';
  }[];
}

export interface CoefficientUpdateResponse {
  success: boolean;
  message?: string;
}
