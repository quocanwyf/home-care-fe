// src/components/UserForm.jsx
import { useState } from 'react';

import type { OrderFormData } from '@/types/params/order-params';

import CustomerArea from './CustomerArea';
import InformationOrderArea from './InformationOrderArea';

export default function OrderForm() {
  const [formData, setFormData] = useState<OrderFormData>({
    //isCusHasAccount: false, // Chưa sử dụng
    //customerId: '', // Chưa sử dụng, nếu có tk thì sẽ dùng, k thì trả null
    // Vùng khách hàng
    phoneNumberCustomer: '',
    fullNameCustomer: '',
    location: {
      addressNum: '',
      city: '',
      ward: '',
    },
    // Vùng thông tin đơn hàng
    // serviceType: '', //
    // requestType: '', //short-term, long-term
    workDates: {
      startDate: '', //dd/mm/yyyy
      endDate: '', //dd/mm/yyyy
    },
    // workTime: {
    //   startTime: '', //hh:mm
    //   endTime: '', //hh:mm
    // },
    // paymentType: '', // cash | credit
    // totalHelperCost: '',
    // totalOrderCost: '',
    // helperId: '', // gán ngv đang có trạng thái workingStatus online
    // discounts: [],
  });

  const handleUpdateFormData = (newData: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  return (
    <div className="h-full w-full overflow-auto">
      <CustomerArea
        formData={formData}
        onUpdateFormData={handleUpdateFormData}
      />
      <InformationOrderArea
        formData={formData}
        onUpdateFormData={handleUpdateFormData}
      />
    </div>
  );
}
