import { useState } from 'react';

import Icon from '@/components/common/icons/ImageIcon';
import MenuIcon from '@/components/common/icons/MenuIcon';
import NotificationBell from '@/components/common/icons/NotificationBell';

import SearchInput from '../common/primitives/SearchInput';

const Header = ({
  onOpenMenuClick,
  onMobileSidebarOpen,
  title,
}: {
  onOpenMenuClick: () => void;
  onMobileSidebarOpen: boolean;
  title: string;
}) => {
  const [query, setQuery] = useState('');
  return (
    <header className="flex flex-col gap-4 rounded-2xl px-2 py-4 shadow-md">
      <div className="flex items-center justify-between">
        <div className="ml-1 text-lg font-bold text-white">
          Full name - Role / {title} Page
        </div>

        <div className="flex items-center justify-center gap-8">
          <div className="max-tablet:hidden">
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Search by phone number..."
            />
          </div>
          <div className="flex flex-row-reverse gap-4">
            {/* Menu icon only display on the mobile */}
            <MenuIcon
              onOpenMenuClick={onOpenMenuClick}
              onMobileSidebarOpen={onMobileSidebarOpen}
            />
            <Icon
              src="/icon-image/avatar-1.png"
              alt="avatar"
              className="transition-transform duration-300 ease-in-out hover:scale-120"
              contentTooltip="User Avatar"
            />

            <NotificationBell
              count={5}
              className="transition-transform duration-300 ease-in-out hover:scale-110"
            />

            <Icon
              src="/icon-image/sun-moon.png"
              alt="Toggle dark mode"
              className="transition-transform duration-300 ease-in-out hover:scale-110"
              contentTooltip="Toggle dark mode"
            />
          </div>
        </div>
      </div>
      <div className="max-tablet:block hidden">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search by phone number..."
        />
      </div>
    </header>
  );
};

export default Header;
