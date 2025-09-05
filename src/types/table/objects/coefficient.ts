export interface CoefficientItem {
  title: string;
  description: string;
  value: number;
  deleted: boolean;
  status: 'active' | 'inactive';
  _id: string;
  parentTitle?: string;
  parentApplyTo?: 'service' | 'helper' | 'other';
  parentId?: string;
}

export interface CostFactorList {
  _id: string;
  title: string;
  description: string;
  applyTo: 'service' | 'helper' | 'other';
  status: 'active' | 'inactive';
  coefficientList: CoefficientItem[];
}
