import { useEffect, useRef } from 'react';

import { MessageCircle, Users } from 'lucide-react';

import {
  useGetConversationDetail,
  useGetMessages,
  useMarkAsRead,
} from '@/hooks/api/useChat.api';

import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageList from './MessageList';

interface ChatAreaProps {
  conversationId: string;
  currentUserId: string;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  conversationId,
  currentUserId,
}) => {
  const { data: conversationDetail, isLoading: isLoadingDetail } =
    useGetConversationDetail(conversationId);
  const { data: messagesData, isLoading: isLoadingMessages } =
    useGetMessages(conversationId);
  const markAsReadMutation = useMarkAsRead();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesData?.messages && messagesData.messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messagesData?.messages]);

  // Mark messages as read when conversation is opened
  useEffect(() => {
    if (conversationId && currentUserId && messagesData?.messages) {
      const timer = setTimeout(() => {
        markAsReadMutation.mutate({ conversationId, userId: currentUserId });
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [conversationId, currentUserId, messagesData?.messages]);

  // Empty state khi chưa chọn conversation
  if (!conversationId) {
    return (
      <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100 shadow-lg">
            <MessageCircle className="h-12 w-12 text-blue-500" />
          </div>
          <h3 className="mb-3 text-xl font-semibold text-gray-900">
            Choose a conversation
          </h3>
          <p className="mb-6 text-gray-500">
            Select a conversation from the list on the left to start messaging
            with staff colleagues
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              <span>Group chat</span>
            </div>
            <div className="flex items-center">
              <MessageCircle className="mr-2 h-4 w-4" />
              <span>Real-time messaging</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const conversation = conversationDetail?.data;
  const messages = messagesData?.messages || [];
  const otherParticipant = conversation?.participants.find(
    (p) => p.id !== currentUserId
  );

  return (
    <div className="flex flex-1 flex-col bg-white">
      {/* Chat Header */}
      <ChatHeader participant={otherParticipant} isLoading={isLoadingDetail} />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {isLoadingMessages ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
              <p className="text-sm text-gray-500">Loading messages...</p>
            </div>
          </div>
        ) : (
          <>
            <MessageList messages={messages} currentUserId={currentUserId} />
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <MessageInput
        conversationId={conversationId}
        currentUserId={currentUserId}
        disabled={isLoadingDetail || !conversation}
      />
    </div>
  );
};

export default ChatArea;
