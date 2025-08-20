import { FileSpreadsheet } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/helpers/format-currency';
import type { OrderDetailResponse } from '@/types/params/order-params';

interface OrderInformationProps {
  orderData: OrderDetailResponse;
}

const OrderInformation = ({ orderData }: OrderInformationProps) => {
  console.log('ccc', orderData?.request.service.title);
  return (
    <div className="overflow-auto">
      <div className="text-overlay-slider mx-2 mt-4 mb-2 flex flex-row items-center font-bold">
        <FileSpreadsheet className="-mt-1 mr-2 h-5 w-5" />
        <p className="text-sm">ORDER INFORMATION</p>
      </div>
      <Card>
        <CardContent>
          {/* Order Details Grid */}
          <div className="max-tablet:grid-cols-1 grid grid-cols-2 gap-x-16 gap-y-4">
            {/* Row 1 */}
            <div className="flex justify-between">
              <span className="font-semibold text-gray-600">
                Request type:{' '}
              </span>
              <span className="text-overlay-slider font-medium">
                {orderData?.request.service.title}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-600">
                Name customer:
              </span>
              <span className="text-overlay-slider font-medium">
                {orderData?.request.customerInfo.fullName}
              </span>
            </div>

            {/* Row 2 */}
            <div className="flex justify-between">
              <span className="font-semibold text-gray-600">Order date: </span>
              <span className="text-overlay-slider font-medium">
                {orderData?.request.orderDate.split(' ')[0]}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-semibold text-gray-600">
                Phone customer:{' '}
              </span>
              <span className="text-overlay-slider font-medium">
                {orderData?.request.customerInfo.phone}
              </span>
            </div>

            {/* Row 3 */}

            <div className="flex justify-between">
              <span className="font-semibold text-gray-600">Total Cost: </span>
              <span className="font-medium text-blue-600">
                {formatCurrency(orderData?.request.totalCost)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-semibold text-gray-600">
                Status current:
              </span>
              <span className="text-overlay-slider font-medium">
                {orderData?.request.status}
              </span>
            </div>
          </div>
          <div className="mt-4 w-full">
            <span className="mr-4 font-semibold text-gray-600">
              Address work:{' '}
            </span>
            <span
              className="text-overlay-slider max-w-xs truncate text-right font-medium"
              title="a"
            >
              {orderData?.request.customerInfo.address}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderInformation;
