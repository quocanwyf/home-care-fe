import React from 'react';

import { Cloud, X } from 'lucide-react';

import TooltipInfo from '@/components/common/primitives/TooltipInfo';

interface ChatToggleProps {
  isOpen: boolean;
  onClick: () => void;
}

const ChatToggle: React.FC<ChatToggleProps> = ({ isOpen, onClick }) => (
  <div className="fixed right-6 bottom-6 z-50">
    {/* Notification Badge (optional) */}
    {!isOpen && (
      <div className="absolute top-0.5 right-0 z-10 h-2.5 w-2.5 animate-spin rounded-full bg-red-400">
        <div className="absolute inset-0 animate-ping rounded-full bg-red-300 opacity-75"></div>
      </div>
    )}
    <TooltipInfo content={isOpen ? 'Close Chatbot' : 'Open Chatbot'}>
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
      </button>
    </TooltipInfo>
  </div>
);

export default ChatToggle;
