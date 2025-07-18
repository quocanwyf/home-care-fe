import { Bell } from 'lucide-react';

import TooltipInfo from './TooltipInfo';

const NotificationBell = ({
  count = 0,
  className,
}: {
  count: number;
  className?: string;
}) => {
  return (
    <TooltipInfo content="Notifications">
      <div className={`relative h-5 w-5 cursor-pointer ${className}`}>
        <Bell className="absolute top-0.75 right-0.25 text-white" />

        {count > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
            {count}
          </span>
        )}
      </div>
    </TooltipInfo>
  );
};

export default NotificationBell;
