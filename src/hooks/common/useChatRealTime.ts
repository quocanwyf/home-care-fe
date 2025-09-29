import { useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';

interface NewMessageEvent {
  _id: string;
  conversationId: string;
  senderId: string;
  senderType: 'staff' | 'customer' | 'helper';
  content: string;
  timestamp: string;
  senderInfo: {
    fullName: string;
    avatar: string;
  };
}

interface ConversationUpdatedEvent {
  conversationId: string;
  lastMessage: string;
  lastUpdated: string;
}

export const useChatRealTime = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleNewMessage = (event: CustomEvent<NewMessageEvent>) => {
      const newMessage = event.detail;

      console.log('Processing new message:', newMessage);

      // Update messages cache for specific conversation
      queryClient.setQueryData(
        ['chat', 'messages', newMessage.conversationId],
        (oldData: any) => {
          if (!oldData) return oldData;

          // Match với structure từ API: { messages: [...] }
          if (oldData.messages && Array.isArray(oldData.messages)) {
            return {
              ...oldData,
              messages: [...oldData.messages, newMessage],
            };
          }

          return oldData;
        }
      );

      console.log(
        `Added new message to conversation ${newMessage.conversationId}`
      );
    };

    const handleConversationUpdated = (
      event: CustomEvent<ConversationUpdatedEvent>
    ) => {
      const { conversationId, lastMessage, lastUpdated } = event.detail;

      console.log('Processing conversation update:', {
        conversationId,
        lastMessage,
        lastUpdated,
      });

      // Update conversations cache - match với query keys từ useGetConversations
      queryClient
        .getQueryCache()
        .getAll()
        .forEach((query) => {
          if (
            query.queryKey[0] === 'chat' &&
            query.queryKey[1] === 'conversations'
          ) {
            queryClient.setQueryData(query.queryKey, (oldData: any) => {
              if (!oldData) return oldData;

              // Match với structure: { conversationData: [...] }
              if (
                oldData.conversationData &&
                Array.isArray(oldData.conversationData)
              ) {
                return {
                  ...oldData,
                  conversationData: oldData.conversationData.map(
                    (conversation: any) => {
                      if (conversation._id === conversationId) {
                        return {
                          ...conversation,
                          lastMessage,
                          lastUpdated,
                        };
                      }
                      return conversation;
                    }
                  ),
                };
              }

              return oldData;
            });
          }
        });

      console.log(`Updated conversation ${conversationId} lastMessage`);
    };

    // Listen to chat events
    window.addEventListener('newMessage', handleNewMessage as EventListener);
    window.addEventListener(
      'conversationUpdated',
      handleConversationUpdated as EventListener
    );

    return () => {
      window.removeEventListener(
        'newMessage',
        handleNewMessage as EventListener
      );
      window.removeEventListener(
        'conversationUpdated',
        handleConversationUpdated as EventListener
      );
    };
  }, [queryClient]);
};
