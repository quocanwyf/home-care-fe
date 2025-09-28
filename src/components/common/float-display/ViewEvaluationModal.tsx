import { AlertTriangle, CheckCircle, MessageSquare } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { OrderComment } from '@/types/table/objects/orders';

import AppModal from './AppModal';

interface ViewEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  comment: OrderComment;
  helperName: string;
}

const ViewEvaluationModal: React.FC<ViewEvaluationModalProps> = ({
  isOpen,
  onClose,
  comment,
  helperName,
}) => {
  const footer = (
    <Button onClick={onClose} variant="outline">
      Đóng
    </Button>
  );

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center">
          <MessageSquare className="mr-2 h-5 w-5 text-blue-500" />
          <span>Đánh giá công việc</span>
        </div>
      }
      width="max-w-md"
      footer={footer}
    >
      {/* Helper Info */}
      <div className="mb-4 rounded-lg bg-gray-50 p-3">
        <p className="text-sm text-gray-600">
          Đánh giá cho: <span className="font-bold">{helperName}</span>
        </p>
      </div>

      {/* Review Content */}
      <div className="space-y-4">
        {/* Review Text */}
        <div>
          <h4 className="mb-2 text-sm font-medium text-gray-900">
            Nhận xét về chất lượng công việc:
          </h4>
          <div className="rounded-lg border bg-gray-50 p-3">
            <p className="text-sm text-gray-700">{comment.review}</p>
          </div>
        </div>

        {/* Status Indicators */}
        <div>
          <h4 className="mb-3 text-sm font-medium text-gray-900">
            Tình trạng đồ đạc:
          </h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              {comment.loseThings ? (
                <>
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-700">
                    Có mất mát đồ đạc
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-700">
                    Không mất mát đồ đạc
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {comment.breakThings ? (
                <>
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-700">
                    Có làm hỏng đồ đạc
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-700">
                    Không làm hỏng đồ đạc
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppModal>
  );
};

export default ViewEvaluationModal;
