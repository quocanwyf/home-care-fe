import { useState } from 'react';
import CountUp from 'react-countup';

import {
  Activity,
  BarChart3,
  DollarSign,
  TrendingUp as LineIcon,
  ShoppingCart,
  TableProperties,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { ExportButton } from '@/components/common/button/ExportButton';
import { DateRangePicker } from '@/components/common/date-picker/DateRangePicker';
import type { FormattedDateRange } from '@/components/common/date-picker/DateRangePicker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDateToDDMMYYYY } from '@/helpers/date-utitlity';
import {
  useGetDashboardChart,
  useGetDashboardStats,
} from '@/hooks/api/useDashboard.api';
import { useDashboardExport } from '@/hooks/common/useDashboardExport';
import { useIsTabletOrMobile } from '@/hooks/common/useIsTabletOrMobile';
import type {
  ChartParams,
  DashboardParams,
} from '@/types/params/dashboard-params';

type IntervalType = 'day' | 'month' | 'year';
type ChartType = 'bar' | 'line' | 'area';

// Animated Number Component
const AnimatedNumber = ({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  duration = 1.5,
  className = '',
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}) => {
  return (
    <div className={`font-bold text-gray-900 ${className}`}>
      {prefix}
      <CountUp
        start={0}
        end={value || 0}
        duration={duration}
        separator=","
        decimals={decimals}
        decimal="."
        preserveValue
      />
      {suffix}
    </div>
  );
};

const DashboardForm = () => {
  // Set default date range (last 30 days)
  const defaultEndDate = new Date();
  const defaultStartDate = new Date();
  defaultStartDate.setDate(defaultStartDate.getDate() - 30);
  const isMobile = useIsTabletOrMobile();

  const [dateRange, setDateRange] = useState<FormattedDateRange>({
    startDate: formatDateToDDMMYYYY(defaultStartDate),
    endDate: formatDateToDDMMYYYY(defaultEndDate),
  });

  const [interval, setInterval] = useState<IntervalType>('day');
  const [chartType, setChartType] = useState<ChartType>('bar');

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

  // Transform data for recharts
  const chartDisplayData =
    chartData?.data?.map((item) => ({
      date: item._id,
      revenue: item.revenue,
      orders: item.orders,
    })) || [];

  const handleExportComplete = (success: boolean, message: string) => {
    if (success) {
      // Show success notification (replace with your toast library)
      console.log('✅ Export Success:', message);
      // toast.success(message);
    } else {
      // Show error notification
      console.error('❌ Export Error:', message);
      // toast.error(message);
    }
  };

  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
          <p className="font-medium text-gray-900">{`Date: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey === 'revenue'
                ? `Revenue: ${Number(entry.value).toLocaleString()} VNĐ`
                : `Orders: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Render chart based on type
  const renderChart = () => {
    const commonProps = {
      data: chartDisplayData,
      margin: isMobile
        ? { top: 10, right: 10, left: 10, bottom: 40 } // Compact margins on mobile
        : { top: 20, right: 30, left: 20, bottom: 60 },
    };

    const commonAxisProps = {
      xAxis: {
        dataKey: 'date',
        tickLine: false,
        axisLine: false,
        className: 'text-xs',
        angle: isMobile ? -90 : -45, // Vertical on mobile, diagonal on desktop
        textAnchor: 'end' as const,
        height: isMobile ? 40 : 60,
        interval: isMobile ? 'preserveStartEnd' : 0, // Show fewer ticks on mobile
        tick: { fontSize: isMobile ? 10 : 12 },
      },
      yAxisRevenue: {
        yAxisId: 'revenue',
        orientation: 'left' as const,
        tickLine: false,
        axisLine: false,
        className: 'text-xs',
        tickFormatter: (value: number) =>
          isMobile
            ? `${(value / 1000000).toFixed(0)}M` // Compact format: 5M
            : `${(value / 1000).toFixed(0)}K`, // Desktop format: 5000K
        tick: { fontSize: isMobile ? 10 : 12 },
        width: isMobile ? 35 : 60,
      },
      yAxisOrders: {
        yAxisId: 'orders',
        orientation: 'right' as const,
        tickLine: false,
        axisLine: false,
        className: 'text-xs',
        tick: { fontSize: isMobile ? 10 : 12 },
        width: isMobile ? 25 : 50,
      },
    };

    switch (chartType) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <XAxis {...commonAxisProps.xAxis} />
            <YAxis {...commonAxisProps.yAxisRevenue} />
            <YAxis {...commonAxisProps.yAxisOrders} />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              yAxisId="revenue"
              dataKey="revenue"
              fill="#3b82f6"
              name="revenue"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              yAxisId="orders"
              dataKey="orders"
              fill="#39c996"
              name="orders"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );

      case 'line':
        return (
          <LineChart {...commonProps}>
            <XAxis {...commonAxisProps.xAxis} />
            <YAxis {...commonAxisProps.yAxisRevenue} />
            <YAxis {...commonAxisProps.yAxisOrders} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              yAxisId="revenue"
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#3b82f6' }}
            />
            <Line
              yAxisId="orders"
              type="monotone"
              dataKey="orders"
              stroke="#39c996"
              strokeWidth={3}
              dot={{ fill: '#39c996', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#39c996' }}
            />
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <XAxis {...commonAxisProps.xAxis} />
            <YAxis {...commonAxisProps.yAxisRevenue} />
            <YAxis {...commonAxisProps.yAxisOrders} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              yAxisId="revenue"
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.6}
              strokeWidth={2}
            />
            <Area
              yAxisId="orders"
              type="monotone"
              dataKey="orders"
              stroke="#39c996"
              fill="#39c996"
              fillOpacity={0.6}
              strokeWidth={2}
            />
          </AreaChart>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mt-4 flex h-full w-full flex-col gap-4">
      {/* Filter Section */}
      <div className="bg-overlay-slider/8 shadow-around w-full rounded-md border px-4 pb-4">
        <div className="mb-4 flex flex-row items-center justify-between font-bold">
          <div className="flex p-4 px-0">
            <TableProperties className="text-overlay-slider mr-2 h-5 w-5" />
            <p className="text-overlay-slider text-sm">DASHBOARD FILTERS</p>
          </div>

          <ExportButton
            dateRange={dateRange}
            onExportComplete={handleExportComplete}
            className="mt-2"
            size="sm"
            variant="outline"
          />
        </div>

        <div className="tablet:flex-row tablet:items-center flex flex-col gap-4">
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
                      ? 'border-2 border-green-200 bg-green-100 font-bold text-green-800 hover:bg-green-100'
                      : 'text-gray-700 hover:bg-green-50'
                  }`}
                >
                  {type === 'day' ? 'Day' : type === 'month' ? 'Month' : 'Year'}
                </Button>
              ))}
            </div>
          </div>

          {/* Chart Type Selector */}
          <div className="flex flex-col gap-2">
            <label className="ml-2 text-sm font-medium text-gray-700">
              Chart Type :
            </label>
            <div className="flex gap-2">
              {[
                { type: 'bar' as ChartType, icon: BarChart3, label: 'Bar' },
                { type: 'line' as ChartType, icon: LineIcon, label: 'Line' },
                { type: 'area' as ChartType, icon: Activity, label: 'Area' },
              ].map(({ type, icon: Icon, label }) => (
                <Button
                  key={type}
                  variant={chartType === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setChartType(type)}
                  className={`cursor-pointer rounded-xl text-xs transition duration-500 ease-in-out hover:scale-105 ${
                    chartType === type
                      ? 'border-2 border-blue-200 bg-blue-100 font-bold text-blue-800 hover:bg-blue-100'
                      : 'text-gray-700 hover:bg-blue-50'
                  }`}
                >
                  <Icon className="mr-1 h-3 w-3" />
                  {label}
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
            {statsLoading ? (
              <>
                <Skeleton className="mb-2 h-6 w-16" />
                <Skeleton className="h-4 w-32" />
              </>
            ) : (
              <>
                <AnimatedNumber
                  value={statsData?.customers?.total || 0}
                  duration={2.5}
                />
                <p className="text-muted-foreground text-xs">
                  +
                  <CountUp
                    start={0}
                    end={statsData?.customers?.growth || 0}
                    duration={2}
                    preserveValue
                  />{' '}
                  ({statsData?.customers?.growthPercent || '0'}%) previous
                  period
                </p>
              </>
            )}
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
            {statsLoading ? (
              <>
                <Skeleton className="mb-2 h-6 w-16" />
                <Skeleton className="h-4 w-32" />
              </>
            ) : (
              <>
                <AnimatedNumber
                  value={statsData?.orders?.total || 0}
                  duration={2.8}
                />
                <p className="text-muted-foreground text-xs">
                  +
                  <CountUp
                    start={0}
                    end={statsData?.orders?.growth || 0}
                    duration={2.2}
                    preserveValue
                  />{' '}
                  ({statsData?.orders?.growthPercent || '0'}%) previous period
                </p>
              </>
            )}
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
            {statsLoading ? (
              <>
                <Skeleton className="mb-2 h-6 w-24" />
                <Skeleton className="h-4 w-28" />
              </>
            ) : (
              <>
                <AnimatedNumber
                  value={statsData?.revenue?.total || 0}
                  suffix=" VNĐ"
                  duration={3}
                />
                <p className="text-muted-foreground text-xs">
                  TB:{' '}
                  <CountUp
                    start={0}
                    end={statsData?.revenue?.avgPerOrder || 0}
                    duration={2.5}
                    separator=","
                    preserveValue
                  />{' '}
                  VNĐ/order
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Performance Card (mini chart) */}
        <Card className="bg-overlay-slider/8 shadow-around">
          <CardHeader>
            <div className="flex items-center">
              <TrendingUp className="text-overlay-slider mr-2 h-5 w-5" />
              <CardTitle className="text-overlay-slider text-sm font-bold">
                MINI CHART
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {chartLoading ? (
              <div className="flex h-[100px] items-center justify-center">
                <Skeleton className="h-full w-full" />
              </div>
            ) : chartDisplayData.length > 0 ? (
              <ResponsiveContainer width="100%" height={100}>
                <BarChart data={chartDisplayData}>
                  <Bar dataKey="revenue" fill="#39c996" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[100px] items-center justify-center text-gray-500">
                <TrendingUp className="h-8 w-8" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Chart Section */}
      <Card className="bg-overlay-slider/8 shadow-around max-mobile:-mx-10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <TrendingUp className="text-overlay-slider mr-2 h-5 w-5" />
              <CardTitle className="text-overlay-slider text-sm font-bold">
                REVENUE CHART & ORDERS
              </CardTitle>
            </div>
            <div className="text-xs text-gray-500 capitalize">
              {chartType} Chart
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {chartLoading ? (
            <div className="flex h-[400px] items-center justify-center">
              <div className="w-full space-y-4">
                <Skeleton className="mx-auto h-8 w-48" />
                <div className="flex h-[300px] items-end justify-center gap-4">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <Skeleton
                      key={index}
                      className="w-8"
                      style={{ height: `${Math.random() * 150 + 50}px` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : chartDisplayData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              {renderChart()}
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[400px] items-center justify-center text-gray-500">
              <div className="text-center">
                <TrendingUp className="mx-auto mb-2 h-12 w-12 text-gray-400" />
                <p>No chart data available</p>
              </div>
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
            {statsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg bg-white p-3"
                  >
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <div>
                        <Skeleton className="mb-1 h-4 w-24" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            ) : (
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
            )}
          </CardContent>
        </Card>

        {/* Top Services */}
        <Card className="bg-overlay-slider/8 shadow-around">
          <CardHeader>
            <div className="flex items-center">
              <DollarSign className="text-overlay-slider mr-2 h-5 w-5" />
              <CardTitle className="text-overlay-slider text-sm font-bold">
                TOP SERVICES
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg bg-white p-3"
                  >
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <div>
                        <Skeleton className="mb-1 h-4 w-32" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {statsData?.revenueBreakdown?.map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg bg-white p-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-800">
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
                    <span className="text-overlay-slider text-sm font-bold">
                      {service.revenue.toLocaleString()} VNĐ
                    </span>
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
      </div>
    </div>
  );
};

export default DashboardForm;
