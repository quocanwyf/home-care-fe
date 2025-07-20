import { useMemo, useState } from 'react';

import type { Orders } from '@/types/table/orders';

interface UseStatusFilterProps {
  data: Orders[];
  initialStatus?: string;
}

interface UseStatusFilterReturn {
  statusFilter: string;
  filteredData: Orders[];
  handleStatusChange: (status: string) => void;
  resetFilter: () => void;
  availableStatuses: string[];
}

export const useStatusFilter = ({
  data,
  initialStatus = 'all',
}: UseStatusFilterProps): UseStatusFilterReturn => {
  const [statusFilter, setStatusFilter] = useState<string>(initialStatus);
  console.log(statusFilter);

  // Tự động lấy danh sách status từ data
  const availableStatuses = useMemo(() => {
    const statuses = [
      'all',
      ...new Set(data.map((order) => order.status.status)),
    ];
    return statuses;
  }, [data]);

  // Lọc dữ liệu dựa trên status được chọn
  const filteredData = useMemo(() => {
    if (statusFilter === 'all') {
      return data;
    }
    return data.filter((order) => order.status.status === statusFilter);
  }, [data, statusFilter]);

  // Handler để thay đổi status
  const handleStatusChange = (newStatus: string) => {
    setStatusFilter(newStatus);
  };

  // Reset về trạng thái ban đầu
  const resetFilter = () => {
    setStatusFilter(initialStatus);
  };

  return {
    statusFilter,
    filteredData,
    handleStatusChange,
    resetFilter,
    availableStatuses,
  };
};
