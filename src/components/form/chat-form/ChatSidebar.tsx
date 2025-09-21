import { useState } from 'react';

import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { MessageCircle, Plus, UserCheck, Users } from 'lucide-react';

import CreateConversationModal from '@/components/common/float-display/CreateConversationModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useGetConversations } from '@/hooks/api/useChat.api';
import type { ChatConversation } from '@/types/table/objects/chat';

interface ChatSidebarProps {
  staffId: string;
  activeTab: 'staff' | 'customer' | 'helper';
  onTabChange: (tab: 'staff' | 'customer' | 'helper') => void;
  selectedConversationId: string;
  onSelectConversation: (id: string) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  staffId,
  activeTab,
  onTabChange,
  selectedConversationId,
  onSelectConversation,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data: conversationsData, isLoading } = useGetConversations({
    staffId,
    type: activeTab,
  });

  console.log('Conversations Dataa:', conversationsData);

  const tabs = [
    {
      key: 'staff' as const,
      label: 'Nhân viên',
      icon: Users,
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      key: 'customer' as const,
      label: 'Khách hàng',
      icon: UserCheck,
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      key: 'helper' as const,
      label: 'Người giúp việc',
      icon: MessageCircle,
      color: 'bg-purple-500 hover:bg-purple-600',
    },
  ];

  const conversations = conversationsData?.conversationData || [];

  const renderConversationItem = (conversation: ChatConversation) => {
    const otherParticipant = conversation.participants.find(
      (p) => p.id !== staffId
    );
    const isSelected = selectedConversationId === conversation._id;

    return (
      <div
        key={conversation._id}
        onClick={() => onSelectConversation(conversation._id)}
        className={`cursor-pointer rounded-lg p-3 transition-all duration-200 ${
          isSelected
            ? 'border-l-4 border-blue-500 bg-blue-50 shadow-sm'
            : 'hover:bg-gray-50 hover:shadow-sm'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="relative flex-shrink-0">
            <img
              src={otherParticipant?.userAvatar || '/icon-image/avatar-1.png'}
              alt={otherParticipant?.userFullName}
              className="h-12 w-12 rounded-full border-2 border-gray-200 object-cover"
            />
            <div className="absolute -right-1 -bottom-1 h-4 w-4 rounded-full border-2 border-white bg-green-400"></div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center justify-between">
              <p className="truncate text-sm font-semibold text-gray-900">
                {otherParticipant?.userFullName || 'Unknown User'}
              </p>
              <span className="flex-shrink-0 text-xs text-gray-500">
                {formatDistanceToNow(new Date(conversation.lastUpdated), {
                  addSuffix: true,
                  locale: vi,
                })}
              </span>
            </div>

            <p className="mb-1 truncate text-sm text-gray-600">
              {conversation.lastMessage || 'Chưa có tin nhắn'}
            </p>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {otherParticipant?.userPhone}
              </span>
              <Badge variant="secondary" className="px-2 py-0.5 text-xs">
                {conversation.conversationType}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderLoadingSkeleton = () => (
    <div className="space-y-3 p-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="animate-pulse p-3">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 flex-shrink-0 rounded-full bg-gray-300"></div>
            <div className="min-w-0 flex-1">
              <div className="mb-2 h-4 w-3/4 rounded bg-gray-300"></div>
              <div className="mb-1 h-3 w-1/2 rounded bg-gray-300"></div>
              <div className="h-3 w-1/3 rounded bg-gray-300"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex w-80 flex-col border-r bg-gray-50">
      {/* Header - chỉ có title và nút Tạo mới */}
      <div className="border-b bg-white p-4">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center text-xl font-bold text-gray-900">
            <MessageCircle className="mr-2 h-6 w-6 text-blue-500" />
            Tin nhắn
          </h2>
          <Button
            size="sm"
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-500 text-white shadow-sm hover:bg-blue-600"
            title="Tạo cuộc hội thoại với nhân viên"
          >
            <Plus className="mr-1 h-4 w-4" />
            Tạo mới
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-3 text-xs text-gray-500">
          {conversationsData && (
            <span>
              {conversationsData.totalConversations} cuộc hội thoại{' '}
              <span className="font-medium">
                {activeTab === 'staff'
                  ? 'nhân viên'
                  : activeTab === 'customer'
                    ? 'khách hàng'
                    : 'người giúp việc'}
              </span>
            </span>
          )}
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          renderLoadingSkeleton()
        ) : conversations.length === 0 ? (
          <div className="p-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
              <MessageCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mb-1 text-sm font-medium text-gray-900">
              Chưa có cuộc hội thoại
            </h3>
            <p className="text-xs text-gray-500">
              {activeTab === 'staff'
                ? 'Tạo cuộc hội thoại mới với nhân viên'
                : activeTab === 'customer'
                  ? 'Chưa có cuộc hội thoại với khách hàng'
                  : 'Chưa có cuộc hội thoại với người giúp việc'}
            </p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {conversations.map(renderConversationItem)}
          </div>
        )}
      </div>

      {/* Tabs ở cuối - Footer */}
      <div className="border-t bg-white p-3">
        <div className="mb-2">
          <p className="text-xs font-medium text-gray-600">Loại hội thoại:</p>
        </div>
        <div className="flex gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className={`flex flex-1 items-center justify-center rounded-lg px-2 py-2 text-xs transition-all duration-200 ${
                  activeTab === tab.key
                    ? `${tab.color} text-white shadow-md`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={tab.label}
              >
                <Icon className="mr-1 h-3 w-3" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Create Conversation Modal - chỉ tạo với staff */}
      <CreateConversationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        staffId={staffId}
        conversationType="staff" // Cố định là staff
      />
    </div>
  );
};

export default ChatSidebar;
