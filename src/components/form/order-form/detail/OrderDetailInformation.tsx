import { TableProperties } from 'lucide-react';

import { AppTable } from '@/components/table/AppTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { orderDetailColumns } from '@/types/table/column/order-column';
import type { RequestDetail } from '@/types/table/objects/orders';

interface OrderDetailInformationProps {
  requestDetails: RequestDetail[] | undefined;
  isLoading?: boolean;
}

const OrderDetailInformation = ({
  requestDetails,
  isLoading = false,
}: OrderDetailInformationProps) => {
  console.log('Request Details:', requestDetails);
  return (
    <div className="bg-overlay-slider/8 shadow-around my-6 w-full overflow-auto rounded-md px-4 pb-4">
      <div className="text-overlay-slider mx-2 mt-4 mb-4 flex flex-row items-center font-bold">
        <TableProperties className="-mt-1 mr-2 h-5 w-5" />
        <p className="text-sm">ORDER DETAIL INFORMATION</p>
      </div>
      <div className="max-h-72 min-h-[200px]">
        <AppTable
          data={requestDetails || []}
          columns={orderDetailColumns}
          isLoading={isLoading}
          pageHeaderTitle=""
          pageSize={requestDetails?.length || 0}
          totalData={requestDetails?.length || 0}
          isHeader={false}
          isFooter={false}
          heightRow="h-10"
        />
      </div>
    </div>
  );
};

export default OrderDetailInformation;
