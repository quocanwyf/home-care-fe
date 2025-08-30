import ConfirmDialog from '@/components/common/float-display/ConfirmDialog';
import { RolePermissionModal } from '@/components/common/float-display/RolePermissionModal';
import FailLoadingAndEntry from '@/components/fallback/FailLoadingAndEntry';
import LoadingFallback from '@/components/fallback/LoadingFallback';
import { PermissionsTable } from '@/components/table/permissions-table/PermissionTable';
import { PermissionsHeader } from '@/components/table/permissions-table/PermissionsHeader';
import { usePermissionsPage } from '@/hooks/common/usePermissionsPage';

const PermissionsForm = () => {
  const {
    // Data
    rolesData,
    permissionsData,
    selectedRole,
    rolePermissions,
    expandedModules,
    groupedPermissions,
    modules,

    // State
    open,
    isAnyActionLoading,
    showUpdateButtons,
    isLoadingRoleDetail,
    roleDetailError,
    roleDetailData,

    // Confirmation
    roleDeleteConfirmation,

    // Handlers
    handleEditRole,
    handleDeleteRole,
    handleUpdateChanges,
    handleCancelChanges,
    toggleModuleExpansion,
    handlePermissionToggle,
    handleOpenModal,
    handleCloseModal,
    handleModalSave,

    // Utils
    getAllPossiblePermissions,
  } = usePermissionsPage();

  console.log('ca', permissionsData);
  // Loading states
  if (isLoadingRoleDetail) {
    return <LoadingFallback content="Loading role information..." />;
  }

  if (roleDetailError && !roleDetailData) {
    return <FailLoadingAndEntry content="Failed to load role information" />;
  }

  if (!rolesData || !permissionsData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen">
      {/* Header */}
      <PermissionsHeader
        showUpdateButtons={showUpdateButtons}
        isUpdating={isAnyActionLoading}
        onOpenModal={handleOpenModal}
        onUpdateChanges={handleUpdateChanges}
        onCancelChanges={handleCancelChanges}
      />

      {/* Main Permissions Table */}
      <PermissionsTable
        roles={rolesData.records || []}
        groupedPermissions={groupedPermissions}
        modules={modules}
        expandedModules={expandedModules}
        rolePermissions={rolePermissions}
        isAnyActionLoading={isAnyActionLoading}
        onEditRole={handleEditRole}
        onDeleteRole={handleDeleteRole}
        onToggleModuleExpansion={toggleModuleExpansion}
        onPermissionToggle={handlePermissionToggle}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={roleDeleteConfirmation.isDialogOpen}
        onOpenChange={roleDeleteConfirmation.closeDeleteConfirmation}
        title="Delete Role"
        description={roleDeleteConfirmation
          .getDeleteDescription()
          .replace(
            'delete this Role',
            `delete role "${roleDeleteConfirmation.entityData?.roleTitle || 'this role'}"`
          )}
        icon={true}
        danger={true}
        confirmText="Delete Role"
        cancelText="Cancel"
        onConfirm={roleDeleteConfirmation.handleDeleteConfirm}
      ></ConfirmDialog>

      {/* Role Modal */}
      <RolePermissionModal
        isOpen={open}
        onClose={handleCloseModal}
        selectedRole={selectedRole}
        allPermissions={getAllPossiblePermissions()}
        onSave={handleModalSave}
        isLoading={isAnyActionLoading}
      />
    </div>
  );
};

export default PermissionsForm;
