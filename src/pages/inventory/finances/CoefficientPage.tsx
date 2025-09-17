import { useEffect, useState } from 'react';

import AddCoefficientModal from '@/components/common/float-display/AddCoefficientModal';
import { AppTable } from '@/components/table/app-table/AppTable';
import { APPLY_TO_OPTIONS } from '@/constants/dropdown/apply-to-options';
import { capitalizeFirstLetter } from '@/helpers/capitalize-first-letter';
import { useGetCoefficientList } from '@/hooks/api/useCoefficient.api';
import { usePageSize } from '@/hooks/common/usePageSize';
import { useSearchConfig } from '@/hooks/common/useSearchConfig';
import { useStatusFilter } from '@/hooks/common/useStatusFilter';
import { useToast } from '@/hooks/common/useToast';
import { coefficientColumn } from '@/types/table/column/coefficient-column';
import type {
  CoefficientItem,
  CostFactorList,
} from '@/types/table/objects/coefficient';
import type { PaginationState } from '@tanstack/react-table';

const CoefficientPage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCoefficient, setEditingCoefficient] =
    useState<CoefficientItem | null>(null);

  const { showError } = useToast();
  const [coefficients, setCoefficients] = useState<CostFactorList[]>([]);

  // Search and filter states
  const [searchKeyword, setSearchKeyword] = useState('');

  // Pagination
  const [currentPagination, setCurrentPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // ApplyTo Filter (using status filter logic)
  const {
    statusFilter: applyToFilter,
    handleStatusChange: handleApplyToChange,
    resetFilter,
  } = useStatusFilter({
    orders: coefficients,
    initialStatus: 'service', // Default to service
  });

  // Page Size
  const { pageSize, handlePageSizeChange, resetPageSize } = usePageSize({
    initialPageSize: 10,
  });

  // Search Configuration
  useSearchConfig({
    placeholder: 'Search by ID or title...',
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
    setSearchKeyword('');
  };

  // API Parameters
  const params = {
    applyTo: applyToFilter,
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
      // Flatten coefficientList thành individual rows
      const flattenedCoefficients: CoefficientItem[] = [];

      coefficientFetchData.costFactorLists.forEach((costFactor) => {
        costFactor.coefficientList.forEach((coeff) => {
          // Thêm thông tin parent để có context
          flattenedCoefficients.push({
            ...coeff,
            parentTitle: costFactor.title,
            parentApplyTo: costFactor.applyTo,
            parentId: costFactor._id,
          });
        });
      });

      setCoefficients(flattenedCoefficients);
    }
  }, [coefficientFetchData]);

  useEffect(() => {
    if (isError) {
      showError(
        error?.message || 'An error occurred while fetching coefficients.'
      );
    }
  }, [isError, error, showError]);

  const handleEdit = (row: CoefficientItem) => {
    // Thay vì navigate, mở modal với data
    setEditingCoefficient(row);
  };

  const handleCloseEditModal = () => {
    setEditingCoefficient(null);
  };

  return (
    <>
      <AppTable
        data={coefficients}
        columns={coefficientColumn(handleEdit)}
        pageHeaderTitle={`Cost Coefficients - Apply to ${capitalizeFirstLetter(coefficientFetchData?.costFactorLists[0]?.applyTo) || 'Service'}`}
        permissionModule="costCoefficients"
        // ApplyTo filter (using status filter props)
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
        totalData={coefficientFetchData?.totalCostFactors || 0}
        customAddAction={() => {
          if (applyToFilter === 'helper') {
            setIsAddModalOpen(true);
          } else {
            showError(
              `Cannot create ${applyToFilter} coefficients directly. They are managed automatically.`
            );
          }
        }}
        showAddButton={applyToFilter === 'helper'}
      />
      <AddCoefficientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => refetchCoefficients()}
      />

      {/* Edit Modal - reuse AddCoefficientModal */}
      <AddCoefficientModal
        isOpen={!!editingCoefficient}
        onClose={handleCloseEditModal}
        editData={editingCoefficient}
        onSuccess={() => {
          refetchCoefficients();
          setEditingCoefficient(null);
        }}
      />
    </>
  );
};

export default CoefficientPage;
