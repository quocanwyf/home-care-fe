// columns/orderColumns.ts
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

import OrderStatusBadge from '@/components/common/badge/StatusOrdersBadge';
import TableActions from '@/components/table/TableActions';
import type { Maids } from '@/types/table/objects/maids';
import type { Staffs } from '@/types/table/objects/staffs';
import type { ColumnDef } from '@tanstack/react-table';

export const staffMaidColumns = (
  onView?: (row: Staffs | Maids) => void,
  onEdit?: (row: Staffs | Maids) => void,
  onDelete?: (row: Staffs | Maids) => void
): ColumnDef<Staffs | Maids, unknown>[] => [
  {
    accessorKey: 'phoneNumber',
    header: 'Phone number',
  },
  {
    accessorKey: 'fullName',
    header: 'Full name',
  },
  {
    accessorKey: 'address',
    header: 'Address',
  },
  {
    accessorKey: 'dateOfBirth',
    header: 'Date of birth',
    cell: ({ row }) =>
      format(new Date(row.original.dateOfBirth), 'dd/MM/yyyy', { locale: vi }),
  },
  {
    accessorKey: 'status',
    header: 'Status',
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
