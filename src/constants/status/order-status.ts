//màu sắc cho status badge
export const ORDER_STATUS: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Assigned: 'bg-sky-100 text-sky-800 border-sky-200',
  InProgress: 'bg-blue-100 text-blue-800 border-blue-200',
  AwaitingPayment: 'bg-orange-100 text-orange-800 border-orange-200',
  Completed: 'bg-green-100 text-green-800 border-green-200',
  Cancelled: 'bg-red-100 text-red-800 border-red-200',
};
