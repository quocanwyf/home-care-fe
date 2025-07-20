import type { Orders } from '@/types/table/objects/orders';

export const data: Orders[] = [
  // Status: pending
  {
    phoneNumberCustomers: '0909123456',
    addressCustomers: 'Hà Nội',
    serviceCategory: 'Giúp việc theo giờ',
    orderDate: '2025-07-19',
    cost: 200000,
    status: { status: 'pending' },
  },
  {
    phoneNumberCustomers: '0912345678',
    addressCustomers: 'TP. Hồ Chí Minh',
    serviceCategory: 'Dọn dẹp nhà cửa',
    orderDate: '2025-07-18',
    cost: 250000,
    status: { status: 'pending' },
  },
  // Status: assigned
  {
    phoneNumberCustomers: '0933456789',
    addressCustomers: 'Đà Nẵng',
    serviceCategory: 'Giặt là',
    orderDate: '2025-07-17',
    cost: 150000,
    status: { status: 'assigned' },
  },
  {
    phoneNumberCustomers: '0944567890',
    addressCustomers: 'Hải Phòng',
    serviceCategory: 'Giúp việc theo giờ',
    orderDate: '2025-07-16',
    cost: 220000,
    status: { status: 'assigned' },
  },
  // Status: inProgress
  {
    phoneNumberCustomers: '0955678901',
    addressCustomers: 'Cần Thơ',
    serviceCategory: 'Dọn dẹp văn phòng',
    orderDate: '2025-07-15 12:00:00',
    cost: 300000,
    status: { status: 'inProgress' },
  },
  {
    phoneNumberCustomers: '0966789012',
    addressCustomers: 'Hà Nội',
    serviceCategory: 'Giặt là',
    orderDate: '2025-07-14',
    cost: 180000,
    status: { status: 'inProgress' },
  },
  // Status: waitPayment
  {
    phoneNumberCustomers: '0977890123',
    addressCustomers: 'TP. Hồ Chí Minh',
    serviceCategory: 'Giúp việc theo giờ',
    orderDate: '2025-07-13',
    cost: 210000,
    status: { status: 'waitPayment' },
  },
  {
    phoneNumberCustomers: '0988901234',
    addressCustomers: 'Đà Nẵng',
    serviceCategory: 'Dọn dẹp nhà cửa',
    orderDate: '2025-07-12',
    cost: 260000,
    status: { status: 'waitPayment' },
  },
  // Status: completed
  {
    phoneNumberCustomers: '0999012345',
    addressCustomers: 'Hải Phòng',
    serviceCategory: 'Giặt là',
    orderDate: '2025-07-11',
    cost: 170000,
    status: { status: 'completed' },
  },
  {
    phoneNumberCustomers: '0901234567',
    addressCustomers: 'Cần Thơ',
    serviceCategory: 'Dọn dẹp văn phòng',
    orderDate: '2025-07-10',
    cost: 320000,
    status: { status: 'completed' },
  },
  // Status: cancelled
  {
    phoneNumberCustomers: '0912345679',
    addressCustomers: 'Hà Nội',
    serviceCategory: 'Giúp việc theo giờ',
    orderDate: '2025-07-09',
    cost: 200000,
    status: { status: 'cancelled' },
  },
  {
    phoneNumberCustomers: '0923456780',
    addressCustomers: 'TP. Hồ Chí Minh',
    serviceCategory: 'Dọn dẹp nhà cửa',
    orderDate: '2025-07-08',
    cost: 240000,
    status: { status: 'cancelled' },
  },
];
