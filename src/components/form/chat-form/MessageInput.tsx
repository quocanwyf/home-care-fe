import { Suspense, lazy, useEffect, useRef, useState } from 'react';

import { Send, Smile } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useSendMessage } from '@/hooks/api/useChat.api';
import { useToast } from '@/hooks/common/useToast';

// Lazy load EmojiPicker
const EmojiPicker = lazy(() => import('emoji-picker-react'));

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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef<HTMLInputElement>(null);
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
      console.log('Message payload sent:', {
        conversationId,
        senderId: currentUserId,
        senderType: 'staff',
        content: trimmedMessage,
      });
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
      showError('Failed to send message. Please try again.');
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

  const handleEmojiSelect = (emojiData: any) => {
    const emoji = emojiData.emoji;
    setMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);

    // Focus back to input
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  const isSending = sendMessageMutation.isPending || isTyping;

  return (
    <div className="mr-10 border-t bg-white p-2">
      <div className="flex items-center space-x-3">
        {/* Message input area */}
        <div className="relative flex-1">
          <Input
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={disabled ? 'Loading...' : 'Type a message...'}
            disabled={disabled || isSending}
            className="focus:border-overlay-slider w-full resize-none rounded-2xl border px-4 py-3 pr-12 text-sm placeholder-gray-500 disabled:bg-gray-50 disabled:text-gray-400"
            style={{ minHeight: '44px', maxHeight: '120px' }}
          />

          {/* Emoji picker */}
          <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                disabled={disabled || isSending}
                className={`absolute top-1/2 right-2 -translate-y-1/2 hover:bg-gray-100 ${
                  showEmojiPicker ? 'bg-gray-100' : ''
                }`}
                title="Add emoji"
              >
                <Smile className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              side="top"
              align="end"
              className="w-auto border-0 bg-transparent p-0 shadow-lg"
              sideOffset={10}
            >
              {showEmojiPicker && (
                <Suspense fallback={<div className="p-2">Loading...</div>}>
                  <EmojiPicker
                    onEmojiClick={handleEmojiSelect}
                    width={300}
                    height={350}
                    searchDisabled={true}
                    skinTonePickerLocation="PREVIEW"
                    previewConfig={{
                      showPreview: false,
                    }}
                    lazyLoadEmojis={true}
                  />
                </Suspense>
              )}
            </PopoverContent>
          </Popover>
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
    </div>
  );
};

export default MessageInput;
