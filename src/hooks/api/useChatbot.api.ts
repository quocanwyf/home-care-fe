/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState } from 'react';

import { v4 as uuidv4 } from 'uuid';

import type { ChatBotState, ChatMessage } from '@/types/table/objects/chatbot';

import { sendMessageToOpenAI } from '../../apis/chatbot.api';

export const useChatbot = () => {
  const [state, setState] = useState<ChatBotState>({
    messages: [
      {
        id: uuidv4(),
        content:
          'Hello! I am the AI assistant of the Home Care application. How can I assist you today? Hẹ hẹ',
        role: 'assistant',
        timestamp: new Date(),
      },
    ],
    isLoading: false,
    isOpen: false,
  });

  const toggleChat = useCallback(() => {
    setState((prev: any) => ({ ...prev, isOpen: !prev.isOpen }));
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Thêm message của user
    const userMessage: ChatMessage = {
      id: uuidv4(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    setState((prev: any) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
    }));

    try {
      // Gọi OpenAI API
      const response = await sendMessageToOpenAI(content);

      // Thêm response từ bot
      const botMessage: ChatMessage = {
        id: uuidv4(),
        content: response,
        role: 'assistant',
        timestamp: new Date(),
      };

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, botMessage],
        isLoading: false,
      }));
    } catch (error) {
      // Handle error
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        content:
          error instanceof Error ? error.message : 'An unknown error occurred.',
        role: 'assistant',
        timestamp: new Date(),
      };

      setState((prev: any) => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
        isLoading: false,
      }));
    }
  }, []);

  const clearMessages = useCallback(() => {
    setState((prev: any) => ({
      ...prev,
      messages: [
        {
          id: uuidv4(),
          content:
            'Hello! I am the AI assistant of the Home Care application. How can I assist you today? Hẹ hẹ',
          role: 'assistant',
          timestamp: new Date(),
        },
      ],
    }));
  }, []);

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    isOpen: state.isOpen,
    toggleChat,
    sendMessage,
    clearMessages,
  };
};
