import { useEffect, useState } from 'react';

import {
  DollarSign,
  ShoppingCart,
  TableProperties,
  TrendingUp,
  Users,
} from 'lucide-react';

import { DateRangePicker } from '@/components/common/date-picker/DateRangePicker';
import type { FormattedDateRange } from '@/components/common/date-picker/DateRangePicker';
import LoadingFallback from '@/components/fallback/LoadingFallback';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDateToDDMMYYYY } from '@/helpers/date-utitlity';
import {
  useGetDashboardChart,
  useGetDashboardStats,
} from '@/hooks/api/useDashboard.api';
import type {
  ChartParams,
  DashboardParams,
} from '@/types/params/dashboard-params';

type IntervalType = 'day' | 'month' | 'year';

const DashboardForm = () => {
  // Set default date range (last 30 days)
  const defaultEndDate = new Date();
  const defaultStartDate = new Date();
  defaultStartDate.setDate(defaultStartDate.getDate() - 30);

  const [dateRange, setDateRange] = useState<FormattedDateRange>({
    startDate: formatDateToDDMMYYYY(defaultStartDate),
    endDate: formatDateToDDMMYYYY(defaultEndDate),
  });

  const [interval, setInterval] = useState<IntervalType>('day');

  // API calls with current filters
  const dashboardParams: DashboardParams = {
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  };

  const chartParams: ChartParams = {
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    interval,
  };

  const { data: statsData, isLoading: statsLoading } =
    useGetDashboardStats(dashboardParams);
  const { data: chartData, isLoading: chartLoading } =
    useGetDashboardChart(chartParams);

  const handleDateRangeChange = (range: FormattedDateRange | undefined) => {
    if (range) {
      setDateRange(range);
    }
  };

  const handleIntervalChange = (newInterval: IntervalType) => {
    setInterval(newInterval);
  };

  const isLoading = statsLoading || chartLoading;

  if (isLoading) {
    return <LoadingFallback content="Loading order information..." />;
  }

  return (
    <div className="mt-4 flex h-full w-full flex-col gap-4 overflow-y-scroll">
      {/* Filter Section */}
      <div className="bg-overlay-slider/8 shadow-around w-full rounded-md border px-4 pb-4">
        <div className="mb-4 flex flex-row items-center justify-between font-bold">
          <div className="flex p-4 px-0">
            <TableProperties className="text-overlay-slider mr-2 h-5 w-5" />
            <p className="text-overlay-slider text-sm">DASHBOARD FILTERS</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {/* Date Range Picker */}
          <div className="flex flex-col gap-2">
            <label className="ml-2 text-sm font-medium text-gray-700">
              Choose range :
            </label>
            <DateRangePicker
              onChange={handleDateRangeChange}
              className="min-w-[240px]"
              quickSelectionMode="past"
              constraintChooseDate={false}
              value={dateRange}
              placeholder="Chọn khoảng thời gian"
            />
          </div>

          {/* Interval Selector */}
          <div className="flex flex-col gap-2">
            <label className="ml-2 text-sm font-medium text-gray-700">
              Interval :
            </label>
            <div className="flex gap-2">
              {(['day', 'month', 'year'] as IntervalType[]).map((type) => (
                <Button
                  key={type}
                  variant={interval === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleIntervalChange(type)}
                  className={`cursor-pointer rounded-xl text-xs transition duration-500 ease-in-out hover:scale-105 ${
                    interval === type
                      ? 'bg-orange-100 text-orange-800 hover:bg-orange-100'
                      : 'text-gray-700 hover:bg-orange-50'
                  }`}
                >
                  {type === 'day' ? 'Day' : type === 'month' ? 'Month' : 'Year'}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Overview Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Customers Card */}
        <Card className="bg-overlay-slider/8 shadow-around scale-100 transform transition-transform duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-overlay-slider font-medium">
              Customer
            </CardTitle>
            <Users className="text-overlay-slider h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-gray-900">
              {statsData?.customers?.total || 0}
            </div>
            <p className="text-muted-foreground text-xs">
              +{statsData?.customers?.growth || 0} (
              {statsData?.customers?.growthPercent || '0'}%) previous period
            </p>
          </CardContent>
        </Card>

        {/* Orders Card */}
        <Card className="bg-overlay-slider/8 shadow-around scale-100 transform transition-transform duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-overlay-slider font-medium">
              Order
            </CardTitle>
            <ShoppingCart className="text-overlay-slider h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-gray-900">
              {statsData?.orders?.total || 0}
            </div>
            <p className="text-muted-foreground text-xs">
              +{statsData?.orders?.growth || 0} (
              {statsData?.orders?.growthPercent || '0'}%) previous period
            </p>
          </CardContent>
        </Card>

        {/* Revenue Card */}
        <Card className="bg-overlay-slider/8 shadow-around scale-100 transform transition-transform duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-overlay-slider font-medium">
              Revenue
            </CardTitle>
            <DollarSign className="text-overlay-slider h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-gray-900">
              {statsData?.revenue?.total?.toLocaleString() || 0} VNĐ
            </div>
            <p className="text-muted-foreground text-xs">
              TB: {statsData?.revenue?.avgPerOrder?.toLocaleString() || 0}{' '}
              VNĐ/order
            </p>
          </CardContent>
        </Card>

        {/* Performance Card */}
        <Card className="bg-overlay-slider/8 shadow-around scale-100 transform transition-transform duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-overlay-slider font-medium">
              Performance
            </CardTitle>
            <TrendingUp className="text-overlay-slider h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-gray-900">
              {statsData?.orders?.completionRate || '0'}%
            </div>
            <p className="text-muted-foreground text-xs">
              Hoàn thành | Hủy: {statsData?.orders?.cancelRate || '0'}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      <Card className="bg-overlay-slider/8 shadow-around">
        <CardHeader>
          <div className="flex items-center">
            <TrendingUp className="text-overlay-slider mr-2 h-5 w-5" />
            <CardTitle className="text-overlay-slider text-sm font-bold">
              REVENUE CHART & ORDERS
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="min-h-[300px]">
          {chartLoading ? (
            <div className="flex h-[300px] items-center justify-center">
              <div className="text-gray-600">Loading . . .</div>
            </div>
          ) : (
            <div className="space-y-2">
              {chartData?.data?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-white p-3"
                >
                  <span className="text-sm font-medium text-gray-900">
                    {item._id}
                  </span>
                  <div className="flex gap-4">
                    <span className="text-sm text-gray-700">
                      <span className="text-muted-foreground">Revenue:</span>{' '}
                      {item.revenue.toLocaleString()} VNĐ
                    </span>
                    <span className="text-sm text-gray-700">
                      <span className="text-muted-foreground">Orders:</span>{' '}
                      {item.orders}
                    </span>
                  </div>
                </div>
              )) || (
                <div className="text-center text-gray-600">
                  Unavailable data
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rankings Section */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Top Helpers */}
        <Card className="bg-overlay-slider/8 shadow-around">
          <CardHeader>
            <div className="flex items-center">
              <Users className="text-overlay-slider mr-2 h-5 w-5" />
              <CardTitle className="text-overlay-slider text-sm font-bold">
                TOP MAIDS
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {statsData?.topHelpers?.map((helper, index) => (
                <div
                  key={helper._id}
                  className="flex items-center justify-between rounded-lg bg-white p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-800">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {helper.fullName}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {helper.phone}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-orange-600">
                    {helper.totalOrders} orders
                  </span>
                </div>
              )) || (
                <div className="text-center text-gray-600">
                  Unavailable data
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Services */}
        <Card className="bg-overlay-slider/8 shadow-around mb-20">
          <CardHeader>
            <div className="flex items-center">
              <DollarSign className="text-overlay-slider mr-2 h-5 w-5" />
              <CardTitle className="text-overlay-slider text-sm font-bold">
                TOP SERVICES
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {statsData?.revenueBreakdown?.map((service, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-white p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-800">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {service.serviceName}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {service.totalOrders} orders
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-orange-600">
                    {service.revenue.toLocaleString()} VNĐ
                  </span>
                </div>
              )) || (
                <div className="text-center text-gray-600">
                  Unavailable data
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardForm;
