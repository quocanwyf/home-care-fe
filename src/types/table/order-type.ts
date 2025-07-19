export interface Order {
  phoneNumber: string;
  address: string;
  serviceCategory: string;
  orderDate: string; // ISO string
  cost: number;
  actions: React.ReactNode;
}
