import { useState } from 'react';

import ChatArea from '@/components/form/chat-form/ChatArea';
import ChatSidebar from '@/components/form/chat-form/ChatSidebar';
import { useAuth } from '@/context/AuthContext';
import { useChatRealTime } from '@/hooks/common/useChatRealTime';

const ChatPage = () => {
  const { user } = useAuth();
  console.log('user', user);

  const [selectedConversationId, setSelectedConversationId] =
    useState<string>('');

  useChatRealTime();

  return (
    <div className="h-[calc(100vh-120px)] overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="flex h-full">
        <ChatSidebar
          selectedConversationId={selectedConversationId}
          onSelectConversation={setSelectedConversationId}
        />

        <ChatArea
          conversationId={selectedConversationId}
          currentUserId={user?._id || ''}
        />
      </div>
    </div>
  );
};

export default ChatPage;
