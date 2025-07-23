import { useEffect, useMemo, useState } from 'react';

import type { ObjectsUnion } from '@/types/table/objects/union-objects';

interface UseStatusFilterProps {
  data: ObjectsUnion[];
  initialStatus?: string;
}

interface UseStatusFilterReturn {
  statusFilter: string;
  filteredData: ObjectsUnion[];
  handleStatusChange: (status: string) => void;
  resetFilter: () => void;
}

export const useStatusFilter = ({
  data,
  initialStatus = 'all',
}: UseStatusFilterProps): UseStatusFilterReturn => {
  const [statusFilter, setStatusFilter] = useState<string>(initialStatus);

  // Lọc dữ liệu dựa trên status được chọn
  const filteredData = useMemo(() => {
    if (statusFilter === 'all') {
      return data;
    }
    return data.filter((objects) => objects.status?.status === statusFilter);
  }, [data, statusFilter]);

  // Handler để thay đổi status
  const handleStatusChange = (newStatus: string) => {
    setStatusFilter(newStatus);
  };

  // Reset về trạng thái ban đầu
  const resetFilter = () => {
    setStatusFilter(initialStatus);
  };

  // Log mỗi khi statusFilter thay đổi
  useEffect(() => {
    console.log('Current status filter:', statusFilter);
  }, [statusFilter]);

  return {
    statusFilter,
    filteredData,
    handleStatusChange,
    resetFilter,
  };
};
