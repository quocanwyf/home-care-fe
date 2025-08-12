// import { useCallback, useMemo, useState } from 'react';

// import { useDateRangeConfig } from '@/hooks/common/useDateRangeConfig';
// import type { PaginationState } from '@tanstack/react-table';

// interface UseTableFiltersProps {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   initialData: any[];
//   initialStatus?: string;
//   initialPageSize?: number;
//   searchPlaceholder?: string;
// }

// export const useTableFilters = ({
//   initialData,
//   initialStatus = 'all',
//   initialPageSize = 10,
//   searchPlaceholder = 'Search...',
// }: UseTableFiltersProps) => {
//   // 1. Pagination state
//   const [pagination, setPagination] = useState<PaginationState>({
//     pageIndex: 0,
//     pageSize: initialPageSize,
//   });

//   // 2. Status filter
//   const [statusFilter, setStatusFilter] = useState(initialStatus);

//   // 3. Search keyword
//   const [searchKeyword, setSearchKeyword] = useState('');

//   // 4. Date range (from context)
//   const { dateRange } = useDateRangeConfig();

//   // Filtered data logic
//   const filteredData = useMemo(() => {
//     let result = initialData;

//     // Apply status filter
//     if (statusFilter !== 'all') {
//       result = result.filter((item) => item.status === statusFilter);
//     }

//     // Apply search filter
//     if (searchKeyword) {
//       result = result.filter((item) =>
//         Object.values(item).some((value) =>
//           String(value).toLowerCase().includes(searchKeyword.toLowerCase())
//         )
//       );
//     }

//     // Apply date range filter
//     if (dateRange.from || dateRange.to) {
//       result = result.filter((item) => {
//         const itemDate = new Date(item.createdAt);
//         if (dateRange.from && itemDate < dateRange.from) return false;
//         if (dateRange.to && itemDate > dateRange.to) return false;
//         return true;
//       });
//     }

//     return result;
//   }, [initialData, statusFilter, searchKeyword, dateRange]);

//   // Handlers
//   const handleStatusChange = useCallback((status: string) => {
//     setStatusFilter(status);
//     setPagination((prev) => ({ ...prev, pageIndex: 0 })); // Reset to first page
//   }, []);

//   const handleSearchChange = useCallback((keyword: string) => {
//     setSearchKeyword(keyword);
//     setPagination((prev) => ({ ...prev, pageIndex: 0 })); // Reset to first page
//   }, []);

//   const handlePageSizeChange = useCallback((size: number) => {
//     setPagination((prev) => ({ pageIndex: 0, pageSize: size }));
//   }, []);

//   const handlePaginationChange = useCallback(
//     (newPagination: PaginationState) => {
//       setPagination(newPagination);
//     },
//     []
//   );

//   const resetAllFilters = useCallback(() => {
//     setStatusFilter(initialStatus);
//     setSearchKeyword('');
//     setPagination({ pageIndex: 0, pageSize: initialPageSize });
//     // DateRange sẽ được reset từ context
//   }, [initialStatus, initialPageSize]);

//   return {
//     // Data
//     filteredData,

//     // States
//     statusFilter,
//     pagination,
//     searchKeyword,
//     dateRange,

//     // Handlers
//     handleStatusChange,
//     handleSearchChange,
//     handlePageSizeChange,
//     handlePaginationChange,
//     resetAllFilters,

//     // Config for search component
//     searchConfig: {
//       placeholder: searchPlaceholder,
//       onSearch: handleSearchChange,
//     },
//   };
// };
