import { AlertTriangle, CheckCircle, MessageSquare } from 'lucide-react';

import type { OrderComment } from '@/types/table/objects/orders';

interface OrderEvaluationCardProps {
  comment: OrderComment;
  helperName: string;
}

const OrderEvaluationCard: React.FC<OrderEvaluationCardProps> = ({
  comment,
  helperName,
}) => {
  if (!comment.review) return null;

  return (
    <div className="mt-4 rounded-lg border bg-gray-50 p-4">
      <div className="mb-3 flex items-center">
        <MessageSquare className="mr-2 h-4 w-4 text-blue-500" />
        <h4 className="font-medium text-gray-900">Đánh giá công việc</h4>
      </div>

      <div className="space-y-3">
        {/* Review Text */}
        <div>
          <p className="text-sm text-gray-700">{comment.review}</p>
        </div>

        {/* Status Indicators */}
        <div className="flex flex-wrap gap-2">
          {comment.loseThings ? (
            <div className="flex items-center rounded-full bg-red-100 px-3 py-1 text-xs text-red-700">
              <AlertTriangle className="mr-1 h-3 w-3" />
              Có mất mát đồ đạc
            </div>
          ) : (
            <div className="flex items-center rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
              <CheckCircle className="mr-1 h-3 w-3" />
              Không mất mát đồ đạc
            </div>
          )}

          {comment.breakThings ? (
            <div className="flex items-center rounded-full bg-red-100 px-3 py-1 text-xs text-red-700">
              <AlertTriangle className="mr-1 h-3 w-3" />
              Có làm hỏng đồ đạc
            </div>
          ) : (
            <div className="flex items-center rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
              <CheckCircle className="mr-1 h-3 w-3" />
              Không làm hỏng đồ đạc
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderEvaluationCard;
