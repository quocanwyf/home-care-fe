export interface DashboardParams {
  startDate: string; // DD/MM/YYYY format
  endDate: string; // DD/MM/YYYY format
}

export interface ChartParams extends DashboardParams {
  interval: 'day' | 'month' | 'year';
}

export interface DashboardStatsResponse {
  customers: {
    total: number;
    growth: number;
    growthPercent: string;
  };
  orders: {
    total: number;
    growth: number;
    growthPercent: string;
    completionRate: string;
    cancelRate: string;
  };
  revenue: {
    total: number;
    avgPerOrder: number;
  };
  topHelpers: Array<{
    _id: string;
    totalOrders: number;
    helperId: string;
    fullName: string;
    phone: string;
  }>;
  revenueBreakdown: Array<{
    revenue: number;
    totalOrders: number;
    serviceName: string;
  }>;
}

export interface DashboardChartResponse {
  success: boolean;
  data: Array<{
    _id: string;
    revenue: number;
    orders: number;
  }>;
}
