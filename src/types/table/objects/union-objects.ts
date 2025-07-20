export type ObjectsWithStatus = {
  status:
    | 'pending'
    | 'assigned'
    | 'inProgress'
    | 'waitPayment'
    | 'completed'
    | 'cancelled'
    | 'active'
    | 'inactive'
    | 'banned';
};

export const ObjectsStatusStyles: Record<ObjectsWithStatus['status'], string> =
  {
    pending: 'bg-yellow-100 text-yellow-800',
    assigned: 'bg-blue-100 text-blue-800',
    inProgress: 'bg-green-100 text-green-800',
    waitPayment: 'bg-orange-100 text-orange-800',
    completed: 'bg-purple-100 text-purple-800',
    cancelled: 'bg-red-100 text-red-800',
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    banned: 'bg-red-100 text-red-800',
  };
