// src/components/UserForm.jsx
import { useState } from 'react';

// Import icon đầu tiên để kiểm tra

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
    serviceType: '', //
    requestType: '', //short-term, long-term
    workDays: {
      startDay: '', //dd/mm/yyyy
      endDay: '', //dd/mm/yyyy
    },
    workTime: {
      startTime: '', //hh:mm
      endTime: '', //hh:mm
    },
    paymentType: '', // cash | credit
    totalHelperCost: '',
    totalOrderCost: '',
    helperId: '', // gán ngv đang có trạng thái workingStatus online
    discounts: [],
  });
  return (
    // Lớp màu nền gradient cho toàn trang
    <p>Nội dung form sẽ ở đây...</p>
  );
}
