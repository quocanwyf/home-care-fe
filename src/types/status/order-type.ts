//các trạng thái chính của đơn hàng
export type OrderStatus =
  | 'Pending' // Nhận đơn
  | 'Assigned' // Giao việc
  | 'InProgress' // Đang làm
  | 'AwaitingPayment' // Chờ thanh toán
  | 'Completed' // Đã hoàn thành
  | 'Cancelled'; // Đã hủy
