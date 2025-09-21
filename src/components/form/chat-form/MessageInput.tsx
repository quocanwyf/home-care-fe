import { useEffect, useRef, useState } from 'react';

import { Paperclip, Send, Smile } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useSendMessage } from '@/hooks/api/useChat.api';
import { useToast } from '@/hooks/common/useToast';

interface MessageInputProps {
  conversationId: string;
  currentUserId: string;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  conversationId,
  currentUserId,
  disabled = false,
}) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { showError } = useToast();
  const sendMessageMutation = useSendMessage();

  // Auto resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSend = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || disabled) return;

    try {
      setIsTyping(true);
      await sendMessageMutation.mutateAsync({
        conversationId,
        senderId: currentUserId,
        senderType: 'staff',
        content: trimmedMessage,
      });

      setMessage('');
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (error) {
      console.error('Error sending message:', error);
      showError('Có lỗi khi gửi tin nhắn. Vui lòng thử lại.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileAttach = () => {
    // Implement file attachment logic
    console.log('File attachment clicked');
  };

  const handleEmojiClick = () => {
    // Implement emoji picker logic
    console.log('Emoji picker clicked');
  };

  const isSending = sendMessageMutation.isPending || isTyping;

  return (
    <div className="border-t bg-white p-4">
      <div className="flex items-end space-x-3">
        {/* Attachment button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFileAttach}
          disabled={disabled}
          className="flex-shrink-0 hover:bg-gray-100"
          title="Đính kèm tệp"
        >
          <Paperclip className="h-4 w-4" />
        </Button>

        {/* Message input area */}
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={disabled ? 'Đang tải...' : 'Nhập tin nhắn...'}
            disabled={disabled || isSending}
            className="w-full resize-none rounded-2xl border border-gray-300 px-4 py-3 pr-12 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-400"
            rows={1}
            style={{ minHeight: '44px', maxHeight: '120px' }}
          />

          {/* Emoji button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEmojiClick}
            disabled={disabled || isSending}
            className="absolute top-1/2 right-2 -translate-y-1/2 hover:bg-gray-100"
            title="Thêm emoji"
          >
            <Smile className="h-4 w-4" />
          </Button>
        </div>

        {/* Send button */}
        <Button
          onClick={handleSend}
          disabled={!message.trim() || disabled || isSending}
          className="flex-shrink-0 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300"
          size="sm"
        >
          {isSending ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Typing indicator placeholder */}
      {isSending && (
        <div className="mt-2 text-xs text-gray-500">
          <span>Đang gửi tin nhắn...</span>
        </div>
      )}
    </div>
  );
};

export default MessageInput;
