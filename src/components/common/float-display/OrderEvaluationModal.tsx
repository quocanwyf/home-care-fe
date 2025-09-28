import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { OrderEvaluation } from '@/types/common/evaluation';

import AppModal from './AppModal';

interface OrderEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (evaluation: OrderEvaluation) => void;
  isLoading?: boolean;
  detailId: string;
  helperName: string;
}

const OrderEvaluationModal: React.FC<OrderEvaluationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  detailId,
  helperName,
}) => {
  const [evaluation, setEvaluation] = useState<OrderEvaluation>({
    review: '',
    loseThings: false,
    breakThings: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (evaluation.review.trim()) {
      onSubmit(evaluation);
    }
  };

  const handleClose = () => {
    setEvaluation({
      review: '',
      loseThings: false,
      breakThings: false,
    });
    onClose();
  };

  const footer = (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={handleClose}
        disabled={isLoading}
      >
        Hủy
      </Button>
      <Button
        type="submit"
        form="evaluation-form"
        disabled={!evaluation.review.trim() || isLoading}
        className="bg-green-600 hover:bg-green-700"
      >
        {isLoading ? 'Đang xử lý...' : 'Hoàn thành đơn'}
      </Button>
    </>
  );

  return (
    <AppModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Đánh giá công việc"
      width="max-w-md"
      footer={footer}
    >
      {/* Helper Info */}
      <div className="mb-4 rounded-lg bg-gray-50 p-3">
        <p className="text-sm text-gray-600">
          Đánh giá cho: <span className="font-bold">{helperName}</span>
        </p>
      </div>

      <form id="evaluation-form" onSubmit={handleSubmit} className="space-y-4">
        {/* Review Textarea */}
        <div>
          <Label htmlFor="review" className="mb-2 block text-sm font-medium">
            Nhận xét về chất lượng công việc *
          </Label>
          <Textarea
            id="review"
            value={evaluation.review}
            onChange={(e) =>
              setEvaluation({ ...evaluation, review: e.target.value })
            }
            placeholder="Chia sẻ cảm nhận của bạn về chất lượng công việc..."
            className="min-h-[100px] resize-none"
            required
            disabled={isLoading}
          />
        </div>

        {/* Checkboxes */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="loseThings"
              checked={evaluation.loseThings}
              onCheckedChange={(checked) =>
                setEvaluation({ ...evaluation, loseThings: !!checked })
              }
              disabled={isLoading}
            />
            <Label
              htmlFor="loseThings"
              className="cursor-pointer text-sm text-gray-700"
            >
              Có mất mát đồ đạc
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="breakThings"
              checked={evaluation.breakThings}
              onCheckedChange={(checked) =>
                setEvaluation({ ...evaluation, breakThings: !!checked })
              }
              disabled={isLoading}
            />
            <Label
              htmlFor="breakThings"
              className="cursor-pointer text-sm text-gray-700"
            >
              Có làm hỏng đồ đạc
            </Label>
          </div>
        </div>
      </form>
    </AppModal>
  );
};

export default OrderEvaluationModal;
