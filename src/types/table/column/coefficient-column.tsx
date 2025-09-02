import StatusBadge from '@/components/common/badge/StatusOrdersBadge';
import TableActions from '@/components/common/button/TableActions';
import type { CostFactorList } from '@/types/table/objects/coefficient';
import type { ColumnDef } from '@tanstack/react-table';

export const coefficientColumn = (
  onView?: (row: CostFactorList) => void,
  onEdit?: (row: CostFactorList) => void
): ColumnDef<CostFactorList, unknown>[] => [
  {
    accessorKey: '_id',
    header: 'ID',
  },
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'applyTo',
    header: 'Apply To',
    cell: ({ row }) => {
      const applyTo = row.original.applyTo;
      return <span className="font-medium capitalize">{applyTo}</span>;
    },
  },
  {
    accessorKey: 'coefficientList',
    header: 'Coefficient Count',
    cell: ({ row }) => {
      const coefficientList = row.original.coefficientList || [];
      return <span className="font-medium">{coefficientList.length}</span>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      return (
        <TableActions onView={onView} onEdit={onEdit} row={row.original} />
      );
    },
  },
];
