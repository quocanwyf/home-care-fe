import { FileSpreadsheet, MapPin, Phone, Star, User } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import type { CustomerDetailInfo } from '@/types/params/customer-params';

interface CustomerInformationProps {
  customerData: CustomerDetailInfo | undefined;
}

const CustomerInformation = ({ customerData }: CustomerInformationProps) => {
  console.log('lozzque', customerData);
  const customer = customerData?.customer;

  if (!customer) {
    return null;
  }

  return (
    <div className="bg-overlay-slider/8 shadow-around my-6 w-full overflow-auto rounded-md px-4 pb-4">
      <div className="text-overlay-slider mx-2 mt-4 mb-4 flex flex-row items-center font-bold">
        <FileSpreadsheet className="-mt-1 mr-2 h-5 w-5" />
        <p className="text-sm">CUSTOMER INFORMATION</p>
      </div>
      <Card>
        <CardContent className="overflow-auto">
          {/* Customer Details Grid */}
          <div className="max-tablet:grid-cols-1 grid grid-cols-2 gap-x-16 gap-y-4">
            {/* Row 1 */}
            <div className="flex justify-between">
              <span className="flex items-center text-sm font-semibold text-gray-600">
                <User className="mr-2 h-4 w-4" />
                Full Name:
              </span>
              <span className="text-overlay-slider text-sm font-medium">
                {customer.fullName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center text-sm font-semibold text-gray-600">
                <Phone className="mr-2 h-4 w-4" />
                Phone Number:
              </span>
              <span className="text-overlay-slider text-sm font-medium">
                {customer.phone}
              </span>
            </div>

            {/* Row 2 */}
            <div className="flex justify-between">
              <span className="flex items-center text-sm font-semibold text-gray-600">
                <Star className="mr-2 h-4 w-4" />
                Loyalty Points:
              </span>
              <span className="text-sm font-medium text-yellow-600">
                {customer.points} points
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm font-semibold text-gray-600">
                <FileSpreadsheet className="mr-2 inline h-4 w-4" />
                Customer ID:
              </span>
              <span className="text-overlay-slider text-sm font-medium">
                {customer._id}
              </span>
            </div>
          </div>

          {/* Address Information */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center text-sm font-semibold text-gray-600">
              <MapPin className="mr-2 h-4 w-4" />
              Address Information:
            </div>

            <div className="ml-6 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Province:
                </span>
                <span className="text-overlay-slider text-sm font-medium">
                  {customer.addresses?.province}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">
                  District:
                </span>
                <span className="text-overlay-slider text-sm font-medium">
                  {customer.addresses?.district}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Ward:</span>
                <span className="text-overlay-slider text-sm font-medium">
                  {customer.addresses?.ward}
                </span>
              </div>
              <div className="mt-3">
                <span className="text-sm font-medium text-gray-600">
                  Detail Address:
                  <span className="text-overlay-slider ml-4">
                    {customer.addresses?.detailAddress}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerInformation;
