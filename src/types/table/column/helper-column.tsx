import OrderStatusBadge from '@/components/common/badge/StatusOrdersBadge';
import TableActions from '@/components/common/button/TableActions';
import AvatarWithSkeleton from '@/components/common/icons/AvatarWithSkeleton';
import type { Helper } from '@/types/params/helpers-params';
import type { ColumnDef } from '@tanstack/react-table';

export const helpersColumns = (
  onView?: (row: Helper) => void,
  onEdit?: (row: Helper) => void,
  onDelete?: (row: Helper) => void
): ColumnDef<Helper, unknown>[] => [
  {
    accessorKey: 'helper_id',
    header: 'Helper ID',
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
    accessorKey: 'workingStatus',
    header: 'Working Status',
    cell: ({ row }) => <OrderStatusBadge status={row.original.status} />,
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
