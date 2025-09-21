import { useLocation, useNavigate } from 'react-router-dom';

// import { MENU_ITEMS } from '@/constants/mock-data/mock-data-sidebar';
import { useAuth } from '@/context/AuthContext';
import { useFilteredMenuItems } from '@/hooks/common/useFilteredMenuItems';

import Logo from '../common/icons/Logo';
import GradientText from '../common/primitives/GradientText';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = useFilteredMenuItems();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(error);
    }
  };

  const handleMenuClick = (path: string, label: string) => {
    if (label === 'Log out') {
      handleLogout();
      return;
    }
    navigate(path);
  };

  const isActiveItem = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return (
      location.pathname === path || location.pathname.startsWith(path + '/')
    );
  };

  return (
    <div className="bg-background-second border-border-primary h-full max-h-screen w-full overflow-y-auto rounded-2xl shadow-md">
      <div className="flex items-center justify-center gap-2 p-4">
        <Logo />
        <span className="text-text-primary font-bold">HOME CARE</span>
        <GradientText content="- ADMIN" />
      </div>

      <div className="border-border-primary mx-4 border-b-3" />

      <nav>
        {menuItems.map((item, idx) => (
          <div key={idx}>
            {item.children ? (
              <div className="text-text-primary mr-10 flex justify-center font-bold">
                {item.label}
              </div>
            ) : (
              <div
                className={`group mx-4 my-1 flex cursor-pointer items-center gap-4 rounded-xl px-3 py-2.5 pl-8 transition-all duration-500 ease-in-out ${
                  isActiveItem(item.path)
                    ? 'bg-tab-hover text-text-secondary font-semibold'
                    : 'hover:bg-tab-hover'
                }`}
                onClick={() => handleMenuClick(item.path, item.label)}
              >
                {item.icon && (
                  <img
                    src={item?.icon}
                    alt={item?.label}
                    className="h-4 w-4 object-cover"
                  />
                )}
                <span
                  className={`${
                    isActiveItem(item.path)
                      ? 'text-text-secondary font-semibold'
                      : 'text-text-primary group-hover:text-text-secondary group-hover:font-semibold'
                  }`}
                >
                  {item.label}
                </span>
              </div>
            )}
            {item.children && (
              <div>
                {item.children.map((child, i) => (
                  <div
                    key={i}
                    className={`group mx-4 my-1 flex cursor-pointer items-center gap-4 rounded-xl px-3 py-2.5 pl-8 transition-all duration-500 ease-in-out ${
                      isActiveItem(child.path)
                        ? 'bg-tab-hover text-text-secondary font-semibold'
                        : 'hover:bg-tab-hover'
                    }`}
                    onClick={() => handleMenuClick(child.path, child.label)}
                  >
                    {child.icon && (
                      <img
                        src={child?.icon}
                        alt={child?.label}
                        className="h-4 w-4 object-cover"
                      />
                    )}
                    <span
                      className={`text-base ${
                        isActiveItem(child.path)
                          ? 'text-text-secondary font-semibold'
                          : 'text-text-primary group-hover:text-text-secondary group-hover:font-semibold'
                      }`}
                    >
                      {child.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}
