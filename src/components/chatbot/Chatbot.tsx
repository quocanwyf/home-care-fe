/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from 'react';

import { useChatbot } from '../../hooks/api/useChatbot.api';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import ChatToggle from './ChatToggle';

const Chatbot: React.FC = () => {
  const { messages, isLoading, isOpen, toggleChat, sendMessage } = useChatbot();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Tự động scroll xuống cuối khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  return (
    <>
      <ChatToggle isOpen={isOpen} onClick={toggleChat} />
      {isOpen && (
        <div className="animate-fade-in fixed right-6 bottom-20 z-50 flex max-h-[70vh] w-80 flex-col rounded-lg border bg-white shadow-lg">
          <div className="flex-1 overflow-y-auto p-4">
            {/* @typescript-eslint/no-explicit-any */}
            {messages.map((msg: any) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>
          <ChatInput onSend={sendMessage} isLoading={isLoading} />
        </div>
      )}
    </>
  );
};

export default Chatbot;
