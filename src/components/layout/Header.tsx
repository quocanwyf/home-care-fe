import Icon from '@/components/common/icons/Icon';
import MenuIcon from '@/components/common/icons/MenuIcon';
import NotificationBell from '@/components/common/icons/NotificationBell';

const Header = ({
  onOpenMenuClick,
  onMobileSidebarOpen,
  title,
}: {
  onOpenMenuClick: () => void;
  onMobileSidebarOpen: boolean;
  title: string;
}) => {
  return (
    <header className="flex items-center justify-between rounded-2xl px-2 py-4 shadow-md">
      <div className="text-lg font-bold text-white">{title}</div>

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
    </header>
  );
};

export default Header;
