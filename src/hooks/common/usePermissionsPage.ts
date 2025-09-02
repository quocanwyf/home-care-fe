import { useEffect, useMemo, useState } from 'react';

import {
  DEFAULT_EXPANDED_MODULES,
  getAllPossiblePermissions,
} from '@/constants/permissions/permissions';
import {
  useCreateRole,
  useDeleteRole,
  useGetPermissions,
  useGetRoleDetail,
  useGetRoles,
  useUpdatePermissions,
  useUpdateRole,
} from '@/hooks/api/usePermissions.api';
import { useConfirmation } from '@/hooks/common/useConfirmation';
import type {
  Permission,
  Role,
  RoleWithPermissions,
} from '@/types/table/objects/permissions';

export const usePermissionsPage = () => {
  // API Hooks
  const { data: rolesData } = useGetRoles();
  const { data: permissionsData } = useGetPermissions();
  const { mutate: updatePermissions, isPending: isUpdating } =
    useUpdatePermissions();
  const { mutate: deleteRole, isPending: isDeletingRole } = useDeleteRole();
  const { mutate: createRole, isPending: isCreatingRole } = useCreateRole();
  const { mutate: updateRole, isPending: isUpdatingRole } = useUpdateRole();

  // State
  const [editingRoleId, setEditingRoleId] = useState<string | undefined>(
    undefined
  );
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleWithPermissions | null>(
    null
  );
  const [permissions, setPermissions] = useState<Permission[]>(
    getAllPossiblePermissions()
  );
  const [rolePermissions, setRolePermissions] = useState<
    Record<string, string[]>
  >({});
  const [originalRolePermissions, setOriginalRolePermissions] = useState<
    Record<string, string[]>
  >({});
  const [expandedModules, setExpandedModules] = useState<string[]>(
    DEFAULT_EXPANDED_MODULES
  );

  // Role Detail Hook
  const {
    data: roleDetailData,
    isLoading: isLoadingRoleDetail,
    error: roleDetailError,
  } = useGetRoleDetail(editingRoleId);

  // Delete Confirmation
  const roleDeleteConfirmation = useConfirmation({
    deleteFunction: (roleId: string) => deleteRole(roleId),
    entityName: 'Role',
    successMessage: 'Role deleted successfully!',
    errorMessage: 'Failed to delete role!',
  });

  // Computed Values
  const isAnyActionLoading = useMemo(
    () =>
      isUpdating ||
      isCreatingRole ||
      isUpdatingRole ||
      isDeletingRole ||
      isLoadingRoleDetail,
    [
      isUpdating,
      isCreatingRole,
      isUpdatingRole,
      isDeletingRole,
      isLoadingRoleDetail,
    ]
  );

  const groupedPermissions = useMemo(() => {
    return permissions.reduce(
      (acc, permission) => {
        if (!acc[permission.module]) {
          acc[permission.module] = [];
        }
        acc[permission.module].push(permission);
        return acc;
      },
      {} as Record<string, Permission[]>
    );
  }, [permissions]);

  const modules = useMemo(
    () => Object.keys(groupedPermissions),
    [groupedPermissions]
  );

  const hasChanges = (): boolean => {
    const currentRoleIds = Object.keys(rolePermissions);
    const originalRoleIds = Object.keys(originalRolePermissions);

    if (currentRoleIds.length !== originalRoleIds.length) return true;

    for (const roleId of currentRoleIds) {
      const currentPerms = rolePermissions[roleId] || [];
      const originalPerms = originalRolePermissions[roleId] || [];

      if (currentPerms.length !== originalPerms.length) return true;

      const currentSorted = [...currentPerms].sort();
      const originalSorted = [...originalPerms].sort();

      for (let i = 0; i < currentSorted.length; i++) {
        if (currentSorted[i] !== originalSorted[i]) return true;
      }
    }

    return false;
  };

  const showUpdateButtons = hasChanges();

  // Effects
  useEffect(() => {
    if (permissionsData?.records) {
      const initialRolePermissions: Record<string, string[]> = {};
      permissionsData.records.forEach((role) => {
        initialRolePermissions[role._id] = [...role.permissions];
      });
      setRolePermissions(initialRolePermissions);
      setOriginalRolePermissions(initialRolePermissions);
    }
  }, [permissionsData]);

  useEffect(() => {
    if (roleDetailData?.record && editingRoleId) {
      setSelectedRole({
        _id: roleDetailData.record._id,
        title: roleDetailData.record.title,
        description: roleDetailData.record.description,
        permissions: roleDetailData.record.permissions || [],
      });

      setOpen(true);
      setEditingRoleId(undefined);
    }
  }, [roleDetailData, editingRoleId]);

  useEffect(() => {
    if (roleDetailError && editingRoleId) {
      console.error('Failed to load role detail:', roleDetailError);
      setEditingRoleId(undefined);
    }
  }, [roleDetailError, editingRoleId]);

  // Handlers
  const handleEditRole = (role: Role) => {
    setEditingRoleId(role._id);
  };

  const handleDeleteRole = (role: Role) => {
    roleDeleteConfirmation.openDeleteConfirmation(role._id, {
      roleTitle: role.title,
      roleDescription: role.description || 'No description',
      roleId: role._id,
    });
  };

  const handleUpdateChanges = async () => {
    try {
      const permissionsArray = Object.entries(rolePermissions).map(
        ([roleId, permissions]) => ({
          id: roleId,
          permissions: permissions,
        })
      );

      updatePermissions(
        { permissions: permissionsArray },
        {
          onSuccess: () => {
            setOriginalRolePermissions({ ...rolePermissions });
          },
          onError: (error) => {
            console.error('Failed to update permissions:', error);
          },
        }
      );
    } catch (error) {
      console.error('Failed to update permissions:', error);
    }
  };

  const handleCancelChanges = () => {
    setRolePermissions({ ...originalRolePermissions });
  };

  const toggleModuleExpansion = (moduleName: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleName)
        ? prev.filter((name) => name !== moduleName)
        : [...prev, moduleName]
    );
  };

  const handlePermissionToggle = (roleId: string, permissionKey: string) => {
    const currentRolePermissions = rolePermissions[roleId] || [];
    const hasPermission = currentRolePermissions.includes(permissionKey);

    let newPermissions: string[];
    if (hasPermission) {
      newPermissions = currentRolePermissions.filter(
        (p) => p !== permissionKey
      );
    } else {
      newPermissions = [...currentRolePermissions, permissionKey];
    }

    setRolePermissions((prev) => ({
      ...prev,
      [roleId]: newPermissions,
    }));
  };

  const handleOpenModal = (role?: Role) => {
    if (role) {
      const roleWithPermissions = permissionsData?.records?.find(
        (r) => r._id === role._id
      );

      if (roleWithPermissions) {
        setSelectedRole(roleWithPermissions);
        setPermissions((prev) =>
          prev.map((permission) => ({
            ...permission,
            hasPermission: roleWithPermissions.permissions.includes(
              permission.permissionKey
            ),
          }))
        );
      }
    } else {
      setSelectedRole(null);
      setPermissions(getAllPossiblePermissions());
    }
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedRole(null);
    setEditingRoleId(undefined);
  };

  const handleModalSave = (roleData: {
    title: string;
    description: string;
    permissions: string[];
  }) => {
    if (selectedRole) {
      updateRole(
        {
          roleId: selectedRole._id,
          roleData: {
            title: roleData.title,
            description: roleData.description,
          },
        },
        {
          onSuccess: () => {
            setOpen(false);
            setSelectedRole(null);
          },
          onError: (error) => {
            console.error('Failed to update role:', error);
          },
        }
      );
    } else {
      createRole(
        {
          title: roleData.title,
          description: roleData.description,
          permissions: roleData.permissions,
        },
        {
          onSuccess: () => {
            setOpen(false);
            setSelectedRole(null);
          },
          onError: (error) => {
            console.error('Failed to create role:', error);
          },
        }
      );
    }
  };

  return {
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
  };
};
