import React from 'react';

import { Bell, RefreshCw, X } from 'lucide-react';

interface NotificationBannerProps {
  count: number;
  onUpdate: () => void;
  onClose: () => void;
  isVisible: boolean;
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({
  count,
  onUpdate,
  onClose,
  isVisible,
}) => {
  if (!isVisible) return null;

  return (
    <div className="animate-in slide-in-from-top-2 max-tablet:mt-2 max-mobile:mt-4 max-tablet:mb-2 max-tablet:p-3 mb-4 rounded-2xl bg-blue-50 p-4 shadow-sm duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Bell className="mr-3 h-5 w-5 text-blue-400" />
          <div>
            <p className="text-overlay-slider text-sm font-semibold">
              Have {count} new orders {count > 1 ? '' : ''}!
            </p>
            <p className="text-overlay-slider/80 max-mobile:hidden mt-1 text-xs">
              Click "Update" to see the latest orders
            </p>
          </div>
        </div>

        <div className="max-mobile:flex-col-reverse flex items-center space-x-2">
          <button
            onClick={onUpdate}
            className="bg-overlay-slider/90 hover:bg-overlay-slider inline-flex items-center rounded-md border border-transparent px-3 py-1 text-sm font-medium text-white transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          >
            <RefreshCw className="mr-1 h-4 w-4" />
            <p className="text-sm">Update</p>
          </button>

          <button
            onClick={onClose}
            className="bg-overlay-slider/10 text-overlay-slider hover:bg-overlay-slider/20 ml-3 inline-flex h-8 w-8 items-center justify-center rounded-full focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          >
            <span className="sr-only">Close</span>
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationBanner;
