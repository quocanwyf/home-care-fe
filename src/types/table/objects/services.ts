export interface ServiceCategory {
  categoryId: string;
  name: string;
  services: Service[];
}

export interface Service {
  _id: string;
  title: string;
  basicPrice: number;
  coefficient_id: string;
  description: string;
  status: string;
  coefficientValue: number;
  coefficientTitle: string;
}

export type ServiceList = {
  [key: string]: Service[];
};

export interface ServiceOption {
  label: string;
  value: string;
  serviceData: {
    title: string;
    cost: number;
    coefficient_service: number;
  };
}

export type CostFactorType = {
  _id: string;
  title: string;
  description: string;
  value: number;
};
