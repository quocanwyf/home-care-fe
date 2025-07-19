import type { Order } from '@/types/table/order-type';
import type { ColumnDef } from '@tanstack/react-table';

export const ORDER_COLUMN: ColumnDef<Order>[] = [
  {
    id: 'index',
    header: 'No.',
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone Number',
  },
  {
    accessorKey: 'address',
    header: 'Address',
  },
  {
    accessorKey: 'serviceCategory',
    header: 'Service Category',
  },
  {
    accessorKey: 'orderDate',
    header: 'Order Date',
    cell: ({ getValue }) => {
      const date = new Date(getValue() as string);
      return date.toLocaleDateString('en-GB'); // dd/mm/yyyy
    },
  },
  {
    accessorKey: 'cost',
    header: 'Cost',
    cell: ({ getValue }) => `$${getValue()}`,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => row.original.actions,
  },
];
