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
    <div>
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
      >
        <div className="space-y-2">
          <div className="text-sm text-gray-600">
            <strong>Role:</strong>{' '}
            {roleDeleteConfirmation.entityData?.roleTitle}
          </div>
          <div className="text-sm text-gray-600">
            <strong>Description:</strong>{' '}
            {roleDeleteConfirmation.entityData?.roleDescription}
          </div>
          <div className="text-sm font-medium text-red-600">
            This action cannot be undone. All users with this role will lose
            their permissions.
          </div>
        </div>
      </ConfirmDialog>

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
