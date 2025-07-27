import OrderStatusBadge from '@/components/common/badge/StatusOrdersBadge';
import TableActions from '@/components/table/TableActions';
import type { Maids } from '@/types/table/objects/maids';
import type { Staffs } from '@/types/table/objects/staffs';
import type { ColumnDef } from '@tanstack/react-table';

import type { HRs } from '../objects/hrs';

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
    // Tạo custom accessor cho location
    accessorKey: 'location',
    header: 'Address',
    cell: ({ row }) => {
      const location = row.getValue('location') as HRs['location'];
      return (
        <div className="max-w-[200px]">
          <div className="text-sm">{location.addressNum}</div>
          <div className="text-muted-foreground text-xs">
            {location.ward}, {location.city}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'dateOfBirth',
    header: 'Date of birth',
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
