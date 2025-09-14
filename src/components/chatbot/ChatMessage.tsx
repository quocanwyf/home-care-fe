import React from 'react';

import type { ChatMessage as ChatMessageType } from '@/types/table/objects/chatbot';

interface Props {
  message: ChatMessageType;
}

const ChatMessage: React.FC<Props> = ({ message }) => (
  <div
    className={`mb-2 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
  >
    <div
      className={`max-w-xs rounded-lg px-4 py-2 text-sm ${
        message.role === 'user'
          ? 'bg-blue-500 text-white'
          : 'bg-gray-200 text-gray-900'
      }`}
    >
      {message.content}
    </div>
  </div>
);

export default ChatMessage;
