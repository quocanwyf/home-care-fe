export const STATUS_ORDERS_PROCESSING = [
  'all',
  'pending',
  'assigned',
  'inProgress',
  'waitPayment',
];

export const STATUS_DISPLAY_ORDERS_PROCESSING_NAME: Record<string, string> = {
  all: 'All',
  pending: 'Pending',
  assigned: 'Assigned',
  inProgress: 'In Progress',
  waitPayment: 'Wait Payment',
};

export const STATUS_ORDERS_DONE = ['completed', 'cancelled'];

export const STATUS_DISPLAY_ORDERS_DONE_NAME: Record<string, string> = {
  completed: 'Completed',
  cancelled: 'Cancelled',
};
