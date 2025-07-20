import { Edit, Eye, Trash2 } from 'lucide-react';

import TooltipInfo from '../common/primitives/TooltipInfo';

interface TableActionsProps<T> {
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  row: T;
}

const TableActions = <T,>({
  onView,
  onEdit,
  onDelete,
  row,
}: TableActionsProps<T>) => {
  return (
    <div className="flex items-center space-x-2">
      {onView && (
        <TooltipInfo content="View details">
          <button
            onClick={() => onView(row)}
            className="cursor-pointer p-1 text-blue-400 transition-colors hover:text-blue-600"
            title="View"
          >
            <Eye className="h-4 w-4" />
          </button>
        </TooltipInfo>
      )}
      {onEdit && (
        <TooltipInfo content="Edit">
          <button
            onClick={() => onEdit(row)}
            className="cursor-pointer p-1 text-green-400 transition-colors hover:text-green-600"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
        </TooltipInfo>
      )}
      {onDelete && (
        <TooltipInfo content="Delete">
          <button
            onClick={() => onDelete(row)}
            className="cursor-pointer p-1 text-red-400 transition-colors hover:text-red-600"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </TooltipInfo>
      )}
    </div>
  );
};

export default TableActions;
