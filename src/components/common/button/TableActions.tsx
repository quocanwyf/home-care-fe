import { Ban, CircleX, Edit, Eye, FileClock, ShieldBan } from 'lucide-react';

import TooltipInfo from '../primitives/TooltipInfo';

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
