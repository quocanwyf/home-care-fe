import React, { useState } from 'react';

import { useLanguage } from '@/context/LanguageContext';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
  const { t } = useLanguage();
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSend} className="flex gap-2 border-t bg-white p-2">
      <input
        className="flex-1 rounded-xl border px-3 py-2 text-sm"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Input message..."
        disabled={isLoading}
      />
      <button
        type="submit"
        className="bg-overlay-slider/90 hover:bg-overlay-slider rounded-2xl px-4 py-2 text-white transition"
        disabled={isLoading}
      >
        <span className="text-sm">{isLoading ? t('sending') : t('send')}</span>
      </button>
    </form>
  );
};

export default ChatInput;
