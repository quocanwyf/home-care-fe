import React, { useState } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
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
        className="flex-1 rounded border px-3 py-2 text-sm"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Input message..."
        disabled={isLoading}
      />
      <button
        type="submit"
        className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
        disabled={isLoading}
      >
        Gửi
      </button>
    </form>
  );
};

export default ChatInput;
