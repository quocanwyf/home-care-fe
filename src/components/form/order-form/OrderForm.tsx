// src/components/UserForm.jsx
import { useState } from 'react';

import CustomerArea from './CustomerArea';

export default function OrderForm() {
  const [formData, setFormData] = useState({
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
    // workDays: {
    //   startDay: '', //dd/mm/yyyy
    //   endDay: '', //dd/mm/yyyy
    // },
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
  const searchCustomerByPhone = async (phoneNumber: string) => {
    console.log('Searching customer by phone:', phoneNumber);

    // Giả lập API call với timeout
    return new Promise((resolve) => {
      setTimeout(() => {
        // Giả lập dữ liệu trả về - có thể có hoặc không có thông tin
        const mockCustomers = {
          '0123456789': {
            fullName: 'Nguyễn Văn A',
            address: '123 Lê Lợi',
            city: 'Ho Chi Minh City',
            ward: 'Ward 1',
          },
          '0987654321': {
            fullName: 'Trần Thị B',
            address: '456 Nguyễn Huệ',
            city: 'Ha Noi',
            ward: 'Dong Da',
          },
        };

        const customer =
          mockCustomers[phoneNumber as keyof typeof mockCustomers];
        console.log('Customer found:', customer);
        resolve(customer || null);
      }, 1500); // 1.5 giây delay
    });
  };

  const handleUpdateFormData = (newData: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  return (
    // Lớp màu nền gradient cho toàn trang
    <div className="h-full w-full">
      <CustomerArea
        formData={formData}
        onUpdateFormData={handleUpdateFormData}
        onSearchCustomer={searchCustomerByPhone}
      />
    </div>
  );
}
