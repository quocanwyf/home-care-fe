import { ShoppingCart } from 'lucide-react';

import { AppTable } from '@/components/table/app-table/AppTable';
import { useAppNavigate } from '@/hooks/common/useAppNavigate';
import type { CustomerOrderData } from '@/types/params/customer-params';
import { customerOrderColumns } from '@/types/table/column/customer-order-column';

interface CustomerOrdersInformationProps {
  orders: CustomerOrderData[] | undefined;
  isLoading?: boolean;
  totalOrders?: number;
}

const CustomerOrdersInformation = ({
  orders,
  isLoading = false,
  totalOrders = 0,
}: CustomerOrdersInformationProps) => {
  const navigateTo = useAppNavigate();

  const handleViewOrderDetail = (order: string) => {
    console.log('testcc', order);
    navigateTo(`/orders/detail/${order.orderId}`, {
      toast: {
        type: 'success',
        message: 'Navigating to order details!',
      },
      delay: 1000,
    });
  };

  return (
    <div className="bg-overlay-slider/8 shadow-around my-6 w-full rounded-md px-4 pb-4">
      <div className="text-overlay-slider mx-2 mt-4 mb-4 flex flex-row items-center justify-between font-bold">
        <div className="flex items-center">
          <ShoppingCart className="mt-4 mr-2 h-5 w-5" />
          <p className="mt-4 text-sm">CUSTOMER ORDERS</p>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          Total Orders:{' '}
          <span className="font-semibold text-blue-600">{totalOrders}</span>
        </div>
      </div>

      <div className="max-h-[50vh] min-h-[300px]">
        <AppTable
          data={orders || []}
          columns={customerOrderColumns(handleViewOrderDetail)}
          isLoading={isLoading}
          pageHeaderTitle=""
          pageSize={orders?.length || 0}
          totalData={orders?.length || 0}
          isHeader={false}
          isFooter={false}
          heightRow="h-12"
        />
        {orders && orders.length === 0 && !isLoading && (
          <div className="flex h-32 items-center justify-center text-gray-500">
            <div className="text-center">
              <ShoppingCart className="mx-auto mb-2 h-8 w-8" />
              <p>No orders found for this customer</p>
            </div>
          </div>
        )}
        <div className="h-30"></div>
      </div>
    </div>
  );
};

export default CustomerOrdersInformation;
