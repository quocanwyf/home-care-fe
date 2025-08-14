export interface CoefficientItem {
  _id: string;
  title: string;
  value: number;
  description?: string;
}

export interface CoefficientOther {
  _id: string;
  title: string;
  coefficientList: CoefficientItem[];
}
