import OrderStatusBadge from '@/components/common/badge/StatusOrdersBadge';
import TableActions from '@/components/common/button/TableActions';
import AvatarWithSkeleton from '@/components/common/icons/AvatarWithSkeleton';
import type { Helper } from '@/types/params/helpers-params';
import type { Staff } from '@/types/params/staffs-params';
import type { ColumnDef } from '@tanstack/react-table';

export const staffMaidColumns = (
  onView?: (row: Staff | Helper) => void,
  onEdit?: (row: Staff | Helper) => void,
  onDelete?: (row: Staff | Helper) => void
): ColumnDef<Staff | Helper, unknown>[] => [
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
    id: 'id',
    header: 'ID',
    cell: ({ row }) => {
      const data = row.original;
      if ('helper_id' in data) {
        return data.helper_id;
      }
      if ('staff_id' in data) {
        return data.staff_id;
      }
      return '-';
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <OrderStatusBadge status={row.original.workingStatus} />,
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
