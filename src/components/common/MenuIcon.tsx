import { AlignRight, Menu } from 'lucide-react';

const MenuIcon = ({
  onOpenMenuClick,
  onMobileSidebarOpen,
}: {
  onOpenMenuClick: () => void;
  onMobileSidebarOpen: boolean;
}) => {
  return (
    <div className="desktop:hidden mt-1">
      <button
        className={
          'group cursor-pointer text-2xl transition-all duration-500 ease-in-out'
        }
        onClick={onOpenMenuClick}
      >
        <div className="relative">
          {onMobileSidebarOpen ? (
            <AlignRight
              className={`h-6 w-6 text-white transition-all duration-600 ease-linear group-hover:scale-120`}
            />
          ) : (
            <Menu
              className={`h-6 w-6 text-white transition-all duration-600 ease-linear group-hover:scale-120`}
            />
          )}
        </div>
      </button>
    </div>
  );
};

export default MenuIcon;
