import { Edit, Eye, Trash2 } from 'lucide-react';

type TableActionsProps<T> = {
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  row: T;
};

const TableActions = <T,>({
  onView,
  onEdit,
  onDelete,
  row,
}: TableActionsProps<T>) => {
  return (
    <div className="flex items-center space-x-2">
      {onView && (
        <button
          onClick={() => onView(row)}
          className="p-1 text-blue-400 transition-colors hover:text-blue-600"
          title="View"
        >
          <Eye className="h-4 w-4" />
        </button>
      )}
      {onEdit && (
        <button
          onClick={() => onEdit(row)}
          className="p-1 text-gray-400 transition-colors hover:text-gray-600"
          title="Edit"
        >
          <Edit className="h-4 w-4" />
        </button>
      )}
      {onDelete && (
        <button
          onClick={() => onDelete(row)}
          className="p-1 text-red-400 transition-colors hover:text-red-600"
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default TableActions;
