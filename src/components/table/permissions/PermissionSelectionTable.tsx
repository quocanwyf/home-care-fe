import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Permission } from '@/types/table/objects/permissions';

interface PermissionSelectionTableProps {
  permissions: Permission[];
  selectedPermissions: string[];
  onPermissionToggle: (permissionId: string) => void;
}

const PermissionSelectionTable = ({
  permissions,
  selectedPermissions,
  onPermissionToggle,
}: PermissionSelectionTableProps) => {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Module</TableHead>
            <TableHead className="text-left">Action</TableHead>
            <TableHead className="text-left">Mô tả</TableHead>
            <TableHead className="text-center">Permission</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {permissions.map((permission) => (
            <TableRow key={permission.id} className="hover:bg-gray-50">
              <TableCell className="font-medium text-gray-900">
                {permission.module}
              </TableCell>
              <TableCell className="text-gray-600">
                {permission.action}
              </TableCell>
              <TableCell className="text-gray-600">
                {permission.description}
              </TableCell>
              <TableCell className="text-center">
                <Checkbox
                  checked={selectedPermissions.includes(permission.id)}
                  onCheckedChange={() => onPermissionToggle(permission.id)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PermissionSelectionTable;
