import { useState } from 'react';

import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { MessageCircle, Plus, Users } from 'lucide-react';

import CreateConversationModal from '@/components/common/float-display/CreateConversationModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useGetConversations } from '@/hooks/api/useChat.api';
import type { ChatConversation } from '@/types/table/objects/chat';

interface ChatSidebarProps {
  staffId: string;
  selectedConversationId: string;
  onSelectConversation: (id: string) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  staffId,
  selectedConversationId,
  onSelectConversation,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { user } = useAuth();
  const userId = user?._id || '';

  console.log(userId);

  const { data: conversationsData, isLoading } = useGetConversations({
    userId,
    type: 'staff',
  });

  console.log('conversations', conversationsData);

  const conversations = conversationsData?.conversationData || [];
  const renderConversationItem = (conversation: ChatConversation) => {
    const otherParticipant = conversation.participants.find(
      (p) => p.id !== user?._id
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
                  locale: enUS,
                })}
              </span>
            </div>

            <p className="mb-1 truncate text-sm text-gray-600">
              {conversation.lastMessage || 'No messages yet'}
            </p>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {otherParticipant?.userPhone}
              </span>
              <Badge variant="secondary" className="px-2 py-0.5 text-xs">
                Staff
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
      {/* Header */}
      <div className="border-b bg-white p-4">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center font-semibold text-black">
            <MessageCircle className="text-overlay-slider mr-2 mb-1 h-6 w-6" />
            Staff Chat
          </h2>
          <Button
            size="sm"
            onClick={() => setShowCreateModal(true)}
            className="bg-overlay-slider/90 hover:bg-overlay-slider cursor-pointer text-white shadow-sm"
            title="Create New Chat"
          >
            <Plus className="h-4 w-4" />
            <span className="text-xs">New Chat</span>
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-3 text-xs text-gray-500">
          {conversationsData && (
            <span>
              {conversationsData.totalConversations} conversations with{' '}
              <span className="font-medium">staff</span>
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
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mb-1 text-sm font-medium text-gray-900">
              No conversations yet
            </h3>
            <p className="text-xs text-gray-500">
              Create a new conversation with a staff member
            </p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {conversations.map(renderConversationItem)}
          </div>
        )}
      </div>

      {/* Footer với thông tin */}
      <div className="border-t bg-white p-3">
        <div className="flex items-center justify-center rounded-lg bg-blue-50 px-3 py-2">
          <Users className="mr-2 h-4 w-4 text-blue-500" />
          <span className="text-xs font-medium text-blue-700">Staff Chat</span>
        </div>
      </div>

      {/* Create Conversation Modal - chỉ cho staff */}
      <CreateConversationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        staffId={staffId}
        conversationType="staff"
      />
    </div>
  );
};

export default ChatSidebar;
