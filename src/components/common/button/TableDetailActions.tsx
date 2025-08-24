import { CircleCheck, CircleX, Play } from 'lucide-react';

import TooltipInfo from '../primitives/TooltipInfo';

interface TableDetailActionsProps {
  status: string;
  onCancel?: (detailId: string) => void;
  onStartWork?: (detailId: string) => void;
  onCompleteWork?: (detailId: string) => void;
  isLoading?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  row?: any;
}

const TableDetailActions = ({
  status,
  onCancel,
  onStartWork,
  onCompleteWork,
  row,
}: TableDetailActionsProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {/* Start Work Button */}
      {status === 'assigned' && (
        <TooltipInfo content="Start Work">
          <button
            onClick={() => onStartWork?.(row)}
            className="cursor-pointer p-1 text-yellow-400 transition-colors hover:text-yellow-600"
            title="Start Work"
          >
            <Play className="h-4 w-4" />
          </button>
        </TooltipInfo>
      )}

      {/* Complete Work Button */}
      {status === 'inProgress' && (
        <TooltipInfo content="Complete Work">
          <button
            onClick={() => onCompleteWork?.(row)}
            className="cursor-pointer p-1 text-yellow-400 transition-colors hover:text-yellow-600"
            title="Complete Work"
          >
            <CircleCheck className="h-4 w-4" />
          </button>
        </TooltipInfo>
      )}

      {/* Cancel Button */}
      {(status === 'pending' || status === 'assigned') && (
        <TooltipInfo content="Cancel Work">
          <button
            onClick={() => onCancel?.(row)}
            className="cursor-pointer p-1 text-yellow-400 transition-colors hover:text-yellow-600"
            title="Cancel Work"
          >
            <CircleX className="h-4 w-4" />
          </button>
        </TooltipInfo>
      )}
    </div>
  );
};

export default TableDetailActions;
