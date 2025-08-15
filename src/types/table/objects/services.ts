export interface ServiceCategory {
  categoryId: string;
  name: string;
  services: Service[];
}

export type Service = {
  label: string;
  value: string;
  serviceDate: {
    title: string;
    cost: number;
    coefficient_service: number;
    coefficient_other: number;
  };
};

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
    coefficient_other: number;
  };
}

export type CostFactorType = {
  _id: string;
  title: string;
  description: string;
  value: number;
};
