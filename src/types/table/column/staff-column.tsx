import TableActions from '@/components/common/button/TableActions';
import AvatarWithSkeleton from '@/components/common/icons/AvatarWithSkeleton';
import type { Staff } from '@/types/params/staffs-params';
import type { ColumnDef } from '@tanstack/react-table';

export const staffsColumns = (
  onView?: (row: Staff) => void,
  onEdit?: (row: Staff) => void,
  onDelete?: (row: Staff) => void
): ColumnDef<Staff, unknown>[] => [
  {
    accessorKey: 'staff_id',
    header: 'Staff ID',
  },
  {
    accessorKey: 'phone',
    header: 'Phone number',
  },
  {
    accessorKey: 'fullName',
    header: 'Full name',
  },
  {
    accessorKey: 'avatar',
    header: 'Avatar',
    cell: ({ row }) => (
      <AvatarWithSkeleton src={row.getValue('avatar') as string} size={40} />
    ),
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => (
      <span className="rounded-sm px-2 py-1 text-sm">{row.original.role}</span>
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <TableActions
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        row={row.original}
      />
    ),
  },
];
