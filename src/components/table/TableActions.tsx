import {
  Ban,
  CircleX,
  Edit,
  Eye,
  FileClock,
  ShieldBan,
  Trash2,
} from 'lucide-react';

import TooltipInfo from '../common/primitives/TooltipInfo';

interface TableActionsProps<T> {
  onView?: (row: T) => void | undefined;
  onEdit?: (row: T) => void | undefined;
  onDelete?: (row: T) => void | undefined;
  onBan?: (row: T) => void | undefined;
  onUnban?: (row: T) => void | undefined;
  onViewHistory?: (row: T) => void | undefined;
  canCancel?: boolean;
  row: T;
}

const TableActions = <T,>({
  onView,
  onEdit,
  onDelete,
  onBan,
  onUnban,
  onViewHistory,
  canCancel,
  row,
}: TableActionsProps<T>) => {
  return (
    <div className="flex items-center space-x-2">
      {onUnban ? (
        <TooltipInfo content="Unban">
          <button
            onClick={() => onUnban(row)}
            className="cursor-pointer p-1 text-yellow-400 transition-colors hover:text-yellow-600"
            title="Unban"
          >
            <ShieldBan className="h-4 w-4" />
          </button>
        </TooltipInfo>
      ) : (
        <>
          {' '}
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
          {canCancel && onDelete && (
            <TooltipInfo content="Cancel">
              <button
                onClick={() => onDelete(row)}
                className="cursor-pointer p-1 text-red-400 transition-colors hover:text-red-600"
                title="Cancel"
              >
                <CircleX className="h-4 w-4" />
              </button>
            </TooltipInfo>
          )}
          {onViewHistory && (
            <TooltipInfo content="View history">
              <button
                onClick={() => onViewHistory(row)}
                className="cursor-pointer p-1 text-purple-400 transition-colors hover:text-purple-600"
                title="View history"
              >
                <FileClock className="h-4 w-4" />
              </button>
            </TooltipInfo>
          )}
          {onBan && (
            <TooltipInfo content="Ban">
              <button
                onClick={() => onBan(row)}
                className="cursor-pointer p-1 text-yellow-400 transition-colors hover:text-yellow-600"
                title="Ban"
              >
                <Ban className="h-4 w-4" />
              </button>
            </TooltipInfo>
          )}
        </>
      )}
    </div>
  );
};

export default TableActions;
