import { useEffect, useState } from 'react';

import { AppTable } from '@/components/table/app-table/AppTable';
import { APPLY_TO_OPTIONS } from '@/constants/dropdown/apply-to-options';
import { handleView } from '@/helpers/handle-table-actions';
import { useGetCoefficientList } from '@/hooks/api/useCoefficient.api';
import { useAppNavigate } from '@/hooks/common/useAppNavigate';
import { usePageSize } from '@/hooks/common/usePageSize';
import { useSearchConfig } from '@/hooks/common/useSearchConfig';
import { useStatusFilter } from '@/hooks/common/useStatusFilter';
import { useToast } from '@/hooks/common/useToast';
import { coefficientColumn } from '@/types/table/column/coefficient-column';
import type { PaginationState } from '@tanstack/react-table';

const CoefficientPage = () => {
  const { showError } = useToast();
  const [coefficients, setCoefficients] = useState([]);
  const navigateTo = useAppNavigate();

  // Search and filter states
  const [searchKeyword, setSearchKeyword] = useState('');

  // Pagination
  const [currentPagination, setCurrentPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Apply To Filter (equivalent to status filter but for applyTo)
  const {
    statusFilter: applyToFilter,
    handleStatusChange: handleApplyToChange,
    resetFilter,
  } = useStatusFilter({
    orders: coefficients,
    initialStatus: 'service',
  });

  // Page Size
  const { pageSize, handlePageSizeChange, resetPageSize } = usePageSize({
    initialPageSize: 10,
  });

  // Search Configuration
  useSearchConfig({
    placeholder: 'By coefficient id, title...',
    onSearch: (keyword) => {
      setSearchKeyword(keyword);
    },
  });

  const handlePaginationChange = (pagination: PaginationState) => {
    setCurrentPagination(pagination);
  };

  const resetAllFilters = () => {
    resetFilter();
    resetPageSize();
  };

  // API Parameters
  const params = {
    applyTo: applyToFilter === 'all' ? undefined : applyToFilter,
    search: searchKeyword || undefined,
    page: currentPagination.pageIndex + 1,
    limit: pageSize || 10,
  };

  // API Call
  const {
    data: coefficientFetchData,
    isLoading,
    isError,
    error,
    isFetching,
    refetch: refetchCoefficients,
  } = useGetCoefficientList(params);

  useEffect(() => {
    if (coefficientFetchData) {
      setCoefficients(coefficientFetchData.costFactorLists || []);
    }
  }, [coefficientFetchData]);

  useEffect(() => {
    if (isError) {
      showError(
        error?.message || 'An error occurred while fetching coefficients.'
      );
    }
  }, [isError, error, showError]);

  return (
    <>
      <AppTable
        data={coefficients}
        columns={coefficientColumn((row) =>
          handleView({
            navigateTo,
            path: `/inventory/finances/coefficient/detail/${row._id}`,
          })
        )}
        pageHeaderTitle="Coefficient List"
        permissionModule="coefficient"
        // Apply To filter (using status filter props)
        statusFilter={applyToFilter}
        onStatusFilterChange={handleApplyToChange}
        listStatusFilter={APPLY_TO_OPTIONS}
        // Page size
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        // Pagination
        onPaginationChange={handlePaginationChange}
        // Reset filters
        onResetFilters={resetAllFilters}
        isLoading={isLoading || isFetching}
        totalData={coefficientFetchData?.totalCostFactors || 1}
      />
    </>
  );
};

export default CoefficientPage;
