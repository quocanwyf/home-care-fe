import { MoreVertical, Phone, Video } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ChatParticipant } from '@/types/chat';

interface ChatHeaderProps {
  participant?: ChatParticipant;
  isLoading?: boolean;
  conversationType?: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  participant,
  isLoading,
  conversationType,
}) => {
  const handleCall = () => {
    if (participant?.userPhone) {
      window.open(`tel:${participant.userPhone}`);
    }
  };

  const handleVideoCall = () => {
    // Implement video call logic here
    console.log('Video call to:', participant?.userFullName);
  };

  if (isLoading) {
    return (
      <div className="border-b bg-white px-6 py-4">
        <div className="animate-pulse">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gray-300"></div>
            <div className="flex-1">
              <div className="mb-1 h-4 w-32 rounded bg-gray-300"></div>
              <div className="h-3 w-24 rounded bg-gray-300"></div>
            </div>
            <div className="flex space-x-2">
              <div className="h-8 w-8 rounded bg-gray-300"></div>
              <div className="h-8 w-8 rounded bg-gray-300"></div>
              <div className="h-8 w-8 rounded bg-gray-300"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!participant) {
    return null;
  }

  const getConversationTypeColor = (type?: string) => {
    switch (type) {
      case 'staff':
        return 'bg-blue-100 text-blue-800';
      case 'customer':
        return 'bg-green-100 text-green-800';
      case 'helper':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getConversationTypeLabel = (type?: string) => {
    switch (type) {
      case 'staff':
        return 'Nhân viên';
      case 'customer':
        return 'Khách hàng';
      case 'helper':
        return 'Người giúp việc';
      default:
        return 'Không xác định';
    }
  };

  return (
    <div className="border-b bg-white px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={participant.userAvatar || '/icon-image/avatar-1.png'}
              alt={participant.userFullName}
              className="h-12 w-12 rounded-full border-2 border-gray-200 object-cover"
            />
            <div className="absolute -right-1 -bottom-1 h-4 w-4 rounded-full border-2 border-white bg-green-400"></div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="truncate text-lg font-semibold text-gray-900">
                {participant.userFullName || 'Unknown User'}
              </h3>
              <Badge
                className={`text-xs ${getConversationTypeColor(conversationType)}`}
              >
                {getConversationTypeLabel(conversationType)}
              </Badge>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>{participant.userPhone}</span>
              <span>•</span>
              <div className="flex items-center">
                <div className="mr-1 h-2 w-2 rounded-full bg-green-400"></div>
                <span>Đang hoạt động</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCall}
            className="hover:bg-gray-100"
            title="Gọi điện"
          >
            <Phone className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleVideoCall}
            className="hover:bg-gray-100"
            title="Video call"
          >
            <Video className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-gray-100"
                title="Tùy chọn khác"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Xem thông tin</DropdownMenuItem>
              <DropdownMenuItem>Tìm kiếm tin nhắn</DropdownMenuItem>
              <DropdownMenuItem>Xóa cuộc hội thoại</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
