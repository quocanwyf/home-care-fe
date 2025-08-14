export interface Service {
  serviceId: string;
  title: string;
  desc: string;
  basePrice: string;
  extraCharge: string;
}

export interface ServiceCategory {
  categoryId: string;
  name: string;
  services: Service[];
}
