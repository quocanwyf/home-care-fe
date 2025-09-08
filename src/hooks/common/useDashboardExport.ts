import { useMemo } from 'react';

import type { ExportData } from '@/hooks/common/useExport';

interface DashboardExportParams {
  statsData: any;
  chartData: any[];
  dateRange: {
    startDate: string;
    endDate: string;
  };
  interval: string;
  chartType: string;
}

export const useDashboardExport = ({
  statsData,
  chartData,
  dateRange,
  interval,
  chartType,
}: DashboardExportParams) => {
  const exportData: ExportData = useMemo(() => {
    return {
      summary: {
        dateRange: `${dateRange.startDate} to ${dateRange.endDate}`,
        totalCustomers: statsData?.customers?.total || 0,
        totalOrders: statsData?.orders?.total || 0,
        totalRevenue: statsData?.revenue?.total || 0,
        avgRevenuePerOrder: statsData?.revenue?.avgPerOrder || 0,
        customerGrowth: statsData?.customers?.growth || 0,
        orderGrowth: statsData?.orders?.growth || 0,
        customerGrowthPercent: statsData?.customers?.growthPercent || '0%',
        orderGrowthPercent: statsData?.orders?.growthPercent || '0%',
      },

      chartData: chartData.map((item) => ({
        Date: item.date,
        Revenue: item.revenue,
        Orders: item.orders,
      })),

      topHelpers:
        statsData?.topHelpers?.map((helper: any, index: number) => ({
          Rank: index + 1,
          Name: helper.fullName,
          Phone: helper.phone,
          TotalOrders: helper.totalOrders,
        })) || [],

      topServices:
        statsData?.revenueBreakdown?.map((service: any, index: number) => ({
          Rank: index + 1,
          ServiceName: service.serviceName,
          TotalOrders: service.totalOrders,
          Revenue: service.revenue,
        })) || [],

      metadata: {
        exportDate: new Date().toLocaleString(),
        interval: interval,
        chartType: chartType,
        totalDataPoints: chartData.length,
        topHelpersCount: statsData?.topHelpers?.length || 0,
        topServicesCount: statsData?.revenueBreakdown?.length || 0,
      },
    };
  }, [statsData, chartData, dateRange, interval, chartType]);

  const exportOptions = useMemo(
    () => ({
      fileName: `dashboard-report-${dateRange.startDate.replace(/\//g, '-')}-to-${dateRange.endDate.replace(/\//g, '-')}`,
      chartSelector: '.recharts-wrapper',
      title: 'Home Care Dashboard Report',
    }),
    [dateRange]
  );

  return {
    exportData,
    exportOptions,
  };
};
