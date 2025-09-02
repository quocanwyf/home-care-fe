export interface Coefficient {
  _id: string;
  title: string;
  description: string;
  value: number;
  deleted: boolean;
  status: 'active' | 'inactive';
}

export interface CostFactor {
  _id: string;
  title: string;
  description: string;
  applyTo: 'service' | 'helper' | 'other';
  status: 'active' | 'inactive';
  coefficientList: Coefficient[];
}

export interface CostFactorsResponse {
  success: boolean;
  totalCostFactors: number;
  costFactorLists: CostFactor[];
}

export interface CostFactorDetailResponse {
  success: boolean;
  result: CostFactor;
}

export interface CreateCoefficientRequest {
  title: string;
  description: string;
  value: number;
  status: 'active' | 'inactive';
}

export interface UpdateCostFactorRequest {
  title: string;
  description: string;
  status: 'active' | 'inactive';
  coefficientList: {
    _id?: string;
    title: string;
    description: string;
    value: number;
    status: 'active' | 'inactive';
  }[];
}
