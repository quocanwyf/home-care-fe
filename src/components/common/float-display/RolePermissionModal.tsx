import React, { useEffect, useState } from 'react';

import { FileText, UserCog } from 'lucide-react';

import { PermissionToggleCheckbox } from '@/components/common/checkbox/PermissionToggleCheckbox';
import AppModal from '@/components/common/float-display/AppModal';
import InputLabel from '@/components/common/input/InputLabel';
import { Button } from '@/components/ui/button';

interface Permission {
  id: string;
  module: string;
  action: string;
  permissionKey: string;
  hasPermission: boolean;
  description: string;
}

interface RoleWithPermissions {
  _id: string;
  title: string;
  permissions: string[];
  description?: string;
}

interface RolePermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRole: RoleWithPermissions | null;
  allPermissions: Permission[];
  onSave: (roleData: {
    title: string;
    description: string;
    permissions: string[];
  }) => void;
  isLoading?: boolean;
}

export const RolePermissionModal: React.FC<RolePermissionModalProps> = ({
  isOpen,
  onClose,
  selectedRole,
  allPermissions,
  onSave,
  isLoading = false,
}) => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  const [errors, setErrors] = useState({
    title: '',
    description: '',
  });

  const isEditMode = !!selectedRole;

  // ✅ Initialize permissions và form data khi modal mở
  useEffect(() => {
    if (isOpen) {
      if (selectedRole) {
        // ✅ Edit mode: Load data từ selectedRole
        setFormData({
          title: selectedRole.title,
          description: selectedRole.description || '',
        });

        setPermissions(
          allPermissions.map((permission) => ({
            ...permission,
            hasPermission: selectedRole.permissions.includes(
              permission.permissionKey
            ),
          }))
        );
      } else {
        // ✅ Add mode: Reset form và permissions
        setFormData({
          title: '',
          description: '',
        });

        setPermissions(
          allPermissions.map((permission) => ({
            ...permission,
            hasPermission: false,
          }))
        );
      }
    }
  }, [isOpen, selectedRole, allPermissions]);

  // ✅ Handle permission toggle trong modal
  const handlePermissionToggle = (id: string) => {
    if (isEditMode) return;

    setPermissions((prev) =>
      prev.map((permission) =>
        permission.id === id
          ? { ...permission, hasPermission: !permission.hasPermission }
          : permission
      )
    );
  };

  // ✅ Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // ✅ Clear error khi user nhập
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  // ✅ Handle save
  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    let selectedPermissions: string[];

    if (isEditMode) {
      // ✅ Edit mode: giữ nguyên permissions hiện tại
      selectedPermissions = selectedRole?.permissions || [];
    } else {
      // ✅ Add mode: lấy permissions đã chọn
      selectedPermissions = permissions
        .filter((p) => p.hasPermission)
        .map((p) => p.permissionKey);
    }

    onSave({
      title: formData.title,
      description: formData.description,
      permissions: selectedPermissions,
    });
  };

  // ✅ Handle close
  const handleClose = () => {
    setFormData({ title: '', description: '' });
    setPermissions([]);
    setErrors({ title: '', description: '' }); // ✅ Reset errors
    onClose();
  };

  const validateForm = () => {
    const newErrors = {
      title: '',
      description: '',
    };

    if (!formData.title.trim()) {
      newErrors.title = 'Role name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);

    // Return true nếu không có lỗi
    return !newErrors.title && !newErrors.description;
  };

  const isFormValid = formData.title.trim() && formData.description.trim();

  return (
    <AppModal
      isOpen={isOpen}
      onClose={handleClose}
      title={selectedRole ? 'Edit Role' : 'Add New Role'}
      description={
        isEditMode
          ? 'Edit role information'
          : 'Configure permissions for the new user group'
      }
      width="max-w-4xl"
      footer={
        <>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading || !isFormValid}>
            {isLoading ? 'Saving...' : selectedRole ? 'Update' : 'Create'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* ✅ Form inputs */}
        <div
          className={`grid gap-4 ${isEditMode ? 'grid-cols-1 md:grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}
        >
          <InputLabel
            label={{
              labelTitle: 'Role Name *',
              icon: <UserCog className="h-3 w-3" />,
            }}
            input={{
              inputId: 'role',
              className: `w-full ${errors.title ? 'border-red-500' : ''}`,
              inputName: 'role',
              placeholder: 'Enter role name',
              value: formData.title,
              onChange: (e) => handleInputChange('title', e.target.value),
            }}
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-500">{errors.title}</p>
          )}
          <InputLabel
            label={{
              labelTitle: 'Description',
              icon: <FileText className="h-3 w-3" />,
            }}
            input={{
              inputId: 'description',
              className: `w-full ${errors.description ? 'border-red-500' : ''}`,
              inputName: 'description',
              placeholder: 'Enter description',
              value: formData.description,
              onChange: (e) => handleInputChange('description', e.target.value),
            }}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-500">{errors.description}</p>
          )}
        </div>

        {!isEditMode && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Detailed Permissions</h3>
            <div className="max-h-96 overflow-auto rounded border">
              <table className="w-full">
                <thead className="sticky top-0 bg-gray-50">
                  <tr>
                    <th className="p-3 text-left text-xs font-medium text-gray-600">
                      MODULE
                    </th>
                    <th className="p-3 text-left text-xs font-medium text-gray-600">
                      ACTION
                    </th>
                    <th className="p-3 text-center text-xs font-medium text-gray-600">
                      PERMISSION
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {permissions.map((permission) => (
                    <tr
                      key={permission.id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-3 text-sm">{permission.module}</td>
                      <td className="p-3 text-sm">
                        <div>
                          <div className="capitalize">{permission.action}</div>
                          <div className="text-xs text-gray-500">
                            {permission.description}
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <PermissionToggleCheckbox
                          isChecked={permission.hasPermission}
                          onToggle={() => handlePermissionToggle(permission.id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AppModal>
  );
};
