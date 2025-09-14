import React from 'react';

import { Cloud, X } from 'lucide-react';

interface ChatToggleProps {
  isOpen: boolean;
  onClick: () => void;
}

const ChatToggle: React.FC<ChatToggleProps> = ({ isOpen, onClick }) => (
  <div className="fixed right-6 bottom-6 z-50">
    {/* Notification Badge (optional) */}
    {!isOpen && (
      <div className="absolute -top-1 -right-1 h-3 w-3 animate-pulse rounded-full bg-red-500">
        <div className="absolute inset-0 animate-ping rounded-full bg-red-400 opacity-75"></div>
      </div>
    )}

    <button
      onClick={onClick}
      className={`group bg-overlay-slider/90 hover:bg-overlay-slider relative transform overflow-hidden rounded-full p-4 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl active:scale-95 ${isOpen ? 'rotate-90' : ''} `}
      aria-label={isOpen ? 'Close chatbot' : 'Open chatbot'}
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

      {/* Icon with animation */}
      <div className="relative transition-transform duration-300">
        {isOpen ? (
          <X className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
        ) : (
          <Cloud className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
        )}
      </div>

      {/* Ripple effect on click */}
      <div className="absolute inset-0 rounded-full bg-white opacity-0 transition-opacity duration-150 group-active:opacity-20"></div>
    </button>

    {/* Tooltip */}
    <div className="pointer-events-none absolute top-1/2 right-full mr-3 -translate-y-1/2 transform opacity-0 transition-all duration-300 group-hover:opacity-100">
      <div className="rounded bg-gray-900 px-2 py-1 text-xs whitespace-nowrap text-white shadow-lg">
        {isOpen ? 'Đóng chat' : 'Chat với AI'}
        <div className="absolute top-1/2 left-full -translate-y-1/2 transform border-2 border-transparent border-l-gray-900"></div>
      </div>
    </div>
  </div>
);

export default ChatToggle;
