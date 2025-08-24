import { Save } from 'lucide-react';

import AppModal from '@/components/common/float-display/AppModal';
import PermissionSelectionTable from '@/components/table/permissions/PermissionSelectionTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type {
  Permission,
  RoleFormData,
} from '@/types/table/objects/permissions';

interface RoleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: RoleFormData;
  onFormChange: (data: Partial<RoleFormData>) => void;
  permissions: Permission[];
  onSubmit: () => void;
  isEditing: boolean;
  isLoading?: boolean;
}

const RoleFormModal = ({
  isOpen,
  onClose,
  formData,
  onFormChange,
  permissions,
  onSubmit,
  isEditing,
  isLoading = false,
}: RoleFormModalProps) => {
  const handlePermissionToggle = (permissionId: string) => {
    const currentPermissions = formData.permissions || [];
    const newPermissions = currentPermissions.includes(permissionId)
      ? currentPermissions.filter((id) => id !== permissionId)
      : [...currentPermissions, permissionId];

    onFormChange({ permissions: newPermissions });
  };

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Chỉnh Sửa Role' : 'Thêm Role Mới'}
      width="max-w-4xl"
      footer={
        <div className="flex space-x-3">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button
            onClick={onSubmit}
            disabled={!formData.title.trim() || isLoading}
            className="flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>{isEditing ? 'Cập nhật' : 'Tạo mới'}</span>
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="title">Tên Role *</Label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => onFormChange({ title: e.target.value })}
              placeholder="Nhập tên role"
            />
          </div>
          <div>
            <Label htmlFor="description">Mô tả</Label>
            <Input
              id="description"
              type="text"
              value={formData.description}
              onChange={(e) => onFormChange({ description: e.target.value })}
              placeholder="Nhập mô tả role"
            />
          </div>
        </div>

        <div>
          <Label>Phân quyền chi tiết</Label>
          <PermissionSelectionTable
            permissions={permissions}
            selectedPermissions={formData.permissions}
            onPermissionToggle={handlePermissionToggle}
          />
        </div>
      </div>
    </AppModal>
  );
};

export default RoleFormModal;
