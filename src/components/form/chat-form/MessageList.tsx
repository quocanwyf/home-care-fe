import { format, isToday, isYesterday } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Check, CheckCheck } from 'lucide-react';

import type { ChatMessage } from '@/types/chat';

interface MessageListProps {
  messages: ChatMessage[];
  currentUserId: string;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
}) => {
  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
      return `Hôm qua ${format(date, 'HH:mm')}`;
    } else {
      return format(date, 'dd/MM/yyyy HH:mm', { locale: vi });
    }
  };

  const groupMessagesByDate = (messages: ChatMessage[]) => {
    const groups: { [key: string]: ChatMessage[] } = {};

    messages.forEach((message) => {
      const date = new Date(message.createdAt);
      let dateKey = '';

      if (isToday(date)) {
        dateKey = 'Hôm nay';
      } else if (isYesterday(date)) {
        dateKey = 'Hôm qua';
      } else {
        dateKey = format(date, 'EEEE, dd/MM/yyyy', { locale: vi });
      }

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });

    return groups;
  };

  const renderMessageStatus = (message: ChatMessage, isOwnMessage: boolean) => {
    if (!isOwnMessage) return null;

    const iconClass = 'h-3 w-3';

    switch (message.status) {
      case 'sent':
        return <Check className={`${iconClass} text-gray-400`} />;
      case 'delivered':
        return <CheckCheck className={`${iconClass} text-gray-400`} />;
      case 'read':
        return <CheckCheck className={`${iconClass} text-blue-500`} />;
      default:
        return null;
    }
  };

  const renderMessage = (message: ChatMessage) => {
    const isOwnMessage = message.senderId === currentUserId;

    return (
      <div
        key={message._id}
        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
      >
        <div
          className={`flex max-w-xs items-end space-x-2 lg:max-w-md ${
            isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''
          }`}
        >
          {!isOwnMessage && (
            <img
              src={message.senderInfo.avatar || '/icon-image/avatar-1.png'}
              alt={message.senderInfo.fullName}
              className="h-8 w-8 rounded-full object-cover"
            />
          )}

          <div
            className={`rounded-2xl px-4 py-2 shadow-sm ${
              isOwnMessage
                ? 'bg-blue-500 text-white'
                : 'border bg-white text-gray-900'
            }`}
          >
            {!isOwnMessage && (
              <p className="mb-1 text-xs font-medium text-gray-500">
                {message.senderInfo.fullName}
              </p>
            )}

            <p className="text-sm leading-relaxed break-words">
              {message.content}
            </p>

            <div
              className={`mt-1 flex items-center justify-end space-x-1 text-xs ${
                isOwnMessage ? 'text-blue-100' : 'text-gray-500'
              }`}
            >
              <span>{formatMessageTime(message.createdAt)}</span>
              {renderMessageStatus(message, isOwnMessage)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
            <Check className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-gray-500">Chưa có tin nhắn nào</p>
          <p className="text-sm text-gray-400">
            Gửi tin nhắn đầu tiên để bắt đầu cuộc trò chuyện
          </p>
        </div>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="space-y-6 p-4">
      {Object.entries(messageGroups).map(([dateKey, dateMessages]) => (
        <div key={dateKey}>
          {/* Date separator */}
          <div className="my-6 flex justify-center">
            <span className="rounded-full bg-gray-200 px-4 py-1 text-xs font-medium text-gray-600 shadow-sm">
              {dateKey}
            </span>
          </div>

          {/* Messages for this date */}
          <div className="space-y-4">{dateMessages.map(renderMessage)}</div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
