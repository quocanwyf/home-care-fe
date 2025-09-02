import { useEffect, useState } from 'react';

import ConfirmDialog from '@/components/common/float-display/ConfirmDialog';
import { AppTable } from '@/components/table/app-table/AppTable';
import { STATUS_SERVICES } from '@/constants/dropdown/status-services';
import { useDeleteService, useGetServices } from '@/hooks/api/useServices.api';
import { useConfirmation } from '@/hooks/common/useConfirmation';
import { usePageSize } from '@/hooks/common/usePageSize';
import { useSearchConfig } from '@/hooks/common/useSearchConfig';
import { useToast } from '@/hooks/common/useToast';
import type { Service } from '@/types/params/services-params';
import { servicesColumns } from '@/types/table/column/services-column';
import type { PaginationState } from '@tanstack/react-table';

const ServicesPage = () => {
  const { showError } = useToast();
  const [services, setServices] = useState([]);

  const deleteServiceMutation = useDeleteService();

  const serviceDeleteConfirmation = useConfirmation({
    deleteFunction: (serviceId: string) =>
      deleteServiceMutation.mutateAsync(serviceId),
    entityName: 'Service',
    onDeleteSuccess: () => {
      refetchServices();
    },
    onDeleteError: (error) => {
      console.error('Failed to delete service:', error);
    },
    successMessage: 'Service deleted successfully!',
    errorMessage: 'Service deletion failed!',
  });

  const handleDeleteService = (row: Service) => {
    serviceDeleteConfirmation.openDeleteConfirmation(row._id, {
      title: row.title,
      basicPrice: row.basicPrice,
      status: row.status,
    });
  };

  const [searchKeyword, setSearchKeyword] = useState('');

  const [currentPagination, setCurrentPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { pageSize, handlePageSizeChange, resetPageSize } = usePageSize({
    initialPageSize: 10,
  });

  useSearchConfig({
    placeholder: 'Search by service ID or name...',
    onSearch: (keyword) => {
      setSearchKeyword(keyword);
    },
  });

  const handlePaginationChange = (pagination: PaginationState) => {
    setCurrentPagination(pagination);
  };

  const resetAllFilters = () => {
    resetPageSize();
    setSearchKeyword('');
  };

  const params = {
    limit: pageSize ?? 10,
    page: currentPagination.pageIndex + 1,
    search: searchKeyword ?? '',
  };

  const {
    data: servicesData,
    isLoading,
    error,
    isError,
    isFetching,
    refetch: refetchServices,
  } = useGetServices(params);

  useEffect(() => {
    if (servicesData) {
      setServices(servicesData.services || []);
    }
  }, [servicesData]);

  useEffect(() => {
    if (isError) {
      showError(error?.message || 'An error occurred while fetching services.');
    }
  }, [isError, error, showError]);

  return (
    <>
      <AppTable
        data={services}
        columns={servicesColumns(
          (row) => console.log('Xem service', row),
          (row) => console.log('Sửa service', row),
          handleDeleteService
        )}
        pageHeaderTitle="Services List"
        permissionModule="services"
        //pagesize variable and function
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        listStatusFilter={STATUS_SERVICES}
        //pagination variable and function
        onPaginationChange={handlePaginationChange}
        //reset filters
        onResetFilters={resetAllFilters}
        // isLoading
        isLoading={isLoading || isFetching}
        totalData={servicesData?.totalServices || 0}
      />
      <ConfirmDialog
        open={serviceDeleteConfirmation.isDialogOpen}
        onOpenChange={serviceDeleteConfirmation.closeDeleteConfirmation}
        title="Delete Service"
        description={serviceDeleteConfirmation.getDeleteDescription()}
        icon={true}
        danger={true}
        confirmText="Delete Service"
        cancelText="Keep Service"
        onConfirm={serviceDeleteConfirmation.handleDeleteConfirm}
      >
        <div />
      </ConfirmDialog>
    </>
  );
};

export default ServicesPage;
