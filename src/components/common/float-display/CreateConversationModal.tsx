import { useState } from 'react';

import { Check, Users, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import {
  useCreateConversation,
  useGetAvailableStaff,
} from '@/hooks/api/useChat.api';
import { useToast } from '@/hooks/common/useToast';
import type { AvailableStaff } from '@/types/params/chat-params';

interface CreateConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversationType: 'staff' | 'customer' | 'helper';
}

const CreateConversationModal: React.FC<CreateConversationModalProps> = ({
  isOpen,
  onClose,
  conversationType,
}) => {
  const { user } = useAuth();
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const { showSuccess, showError } = useToast();

  const {
    data: availableStaffData,
    isLoading,
    error,
  } = useGetAvailableStaff(user._id);
  const createConversationMutation = useCreateConversation();

  const handleClose = () => {
    setSelectedStaffId('');
    onClose();
  };

  const handleCreate = async () => {
    if (!selectedStaffId) {
      showError('Vui lòng chọn nhân viên để tạo cuộc hội thoại');
      return;
    }

    try {
      await createConversationMutation.mutateAsync({
        participants: [
          { id: user._id, type: 'staff' },
          { id: selectedStaffId, type: 'staff' },
        ],
        conversationType: conversationType,
      });

      showSuccess('Tạo cuộc hội thoại thành công!');
      handleClose();
    } catch (error) {
      console.error('Error creating conversation:', error);
      showError('Có lỗi xảy ra khi tạo cuộc hội thoại. Vui lòng thử lại.');
    }
  };

  const staffList = availableStaffData?.staffList || [];

  const renderStaffItem = (staff: AvailableStaff) => {
    const isSelected = selectedStaffId === staff._id;

    return (
      <div
        key={staff._id}
        onClick={() => setSelectedStaffId(staff._id)}
        className={`flex cursor-pointer items-center space-x-3 rounded-lg border p-3 transition-all duration-200 ${
          isSelected
            ? 'border-blue-300 bg-blue-50 shadow-sm'
            : 'border-gray-200 hover:bg-gray-50 hover:shadow-sm'
        }`}
      >
        <div className="relative flex-shrink-0">
          <img
            src={staff.avatar || '/icon-image/avatar-1.png'}
            alt={staff.fullName}
            className="h-12 w-12 rounded-full border-2 border-gray-200 object-cover"
          />
          {isSelected && (
            <div className="absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 shadow-sm">
              <Check className="h-3 w-3 text-white" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-gray-900">
            {staff.fullName}
          </p>
          <p className="truncate text-sm text-gray-500">{staff.phone}</p>
        </div>

        {isSelected && (
          <div className="flex-shrink-0">
            <div className="rounded-full bg-blue-100 p-1">
              <Check className="h-4 w-4 text-blue-600" />
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderLoadingSkeleton = () => (
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="animate-pulse rounded-lg border p-3">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 flex-shrink-0 rounded-full bg-gray-300"></div>
            <div className="min-w-0 flex-1">
              <div className="mb-2 h-4 w-3/4 rounded bg-gray-300"></div>
              <div className="h-3 w-1/2 rounded bg-gray-300"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderEmptyState = () => (
    <div className="py-4 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
        <Users className="h-5 w-5 text-gray-400" />
      </div>
      <h3 className="mb-2 text-sm font-medium text-gray-900">
        Không có nhân viên khả dụng
      </h3>
      <p className="text-sm text-gray-500">
        Tất cả nhân viên đã có cuộc hội thoại hoặc không có quyền truy cập.
      </p>
    </div>
  );

  const renderErrorState = () => (
    <div className="py-8 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
        <X className="h-8 w-8 text-red-500" />
      </div>
      <h3 className="mb-2 text-lg font-medium text-gray-900">Có lỗi xảy ra</h3>
      <p className="text-sm text-gray-500">
        Không thể tải danh sách nhân viên. Vui lòng thử lại.
      </p>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-lg">
            <Users className="mr-2 h-4 w-4 text-blue-500" />
            <p className="text-sm">Tạo cuộc hội thoại mới</p>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="mb-3 block text-sm font-medium text-gray-700">
              Chọn nhân viên để trò chuyện:
            </label>

            <div className="max-h-80 overflow-y-auto">
              {isLoading ? (
                renderLoadingSkeleton()
              ) : error ? (
                renderErrorState()
              ) : staffList.length === 0 ? (
                renderEmptyState()
              ) : (
                <div className="space-y-3">
                  {staffList.map(renderStaffItem)}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={handleClose}>
              <p className="text-xs">Hủy</p>
            </Button>
            <Button
              onClick={handleCreate}
              disabled={
                !selectedStaffId ||
                createConversationMutation.isPending ||
                staffList.length === 0
              }
              className="bg-overlay-slider/90 hover:bg-overlay-slider"
            >
              {createConversationMutation.isPending ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Đang tạo...
                </>
              ) : (
                <>
                  <Check className="mr-1 h-4 w-4" />
                  <p className="text-xs">Tạo cuộc hội thoại</p>
                </>
              )}
            </Button>
          </div>

          {/* Info Text */}
          <div className="rounded-lg bg-blue-50 p-3">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Users className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-800">
                  <strong>Lưu ý:</strong> Bạn đang tạo cuộc hội thoại với{' '}
                  <span className="font-semibold">nhân viên</span> khác trong hệ
                  thống. Cuộc hội thoại sẽ xuất hiện trong tab "Nhân viên".
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateConversationModal;
