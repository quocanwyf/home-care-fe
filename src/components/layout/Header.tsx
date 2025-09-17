import { useCallback, useEffect, useMemo, useState } from 'react';

import { debounce } from 'lodash';

import Icon from '@/components/common/icons/ImageIcon';
import MenuIcon from '@/components/common/icons/MenuIcon';
import NotificationBell from '@/components/common/icons/NotificationBell';
import { useAuth } from '@/context/AuthContext';
import { useSearch } from '@/context/SearchContext';

import { DateRangePicker } from '../common/date-picker/DateRangePicker';
import { HeaderAvatarDropdown } from '../common/dropdowns/HeaderAvatarDropdown';
import LanguageSwitcher from '../common/dropdowns/LanguageSwitcher';
import ThemeDropdown from '../common/dropdowns/ThemeDropdown';
import SearchInput from '../common/input/SearchInput';

const Header = ({
  onOpenMenuClick,
  onMobileSidebarOpen,
  title,
}: {
  onOpenMenuClick: () => void;
  onMobileSidebarOpen: boolean;
  title: string;
}) => {
  const { config } = useSearch();
  const [value, setValue] = useState('');
  const { user, logout, isLoading } = useAuth();

  const getUserDisplayName = useCallback(() => {
    if (!user) {
      return isLoading ? 'Loading...' : 'HomeCare';
    }

    const fullName = user?.fullName || 'User';
    const role = user?.role || 'Role';
    return `${fullName} - ${role} / ${title} Page`;
  }, [user, isLoading, title]);

  // Tạo debounced function bằng useMemo thay vì useCallback
  const debouncedSearch = useMemo(
    () =>
      debounce((val: string) => {
        config.onSearch?.(val);
      }, 500),
    [config]
  );

  // Cleanup khi unmount
  useEffect(() => {
    return () => {
      setValue('');
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleChangeSearch = useCallback(
    (val: string) => {
      setValue(val);
      debouncedSearch(val);
    },
    [debouncedSearch]
  );

  return (
    <header className="flex min-h-[70px] flex-col justify-center gap-4 rounded-2xl px-2 py-4 shadow-md">
      <div className="flex items-center justify-between">
        <div className="ml-1 text-lg font-semibold text-white">
          {/* Full name - Role / {title} Page */}
          {getUserDisplayName()}
        </div>

        <div className="flex items-center justify-center gap-8">
          <div className="max-tablet:hidden max-tablet-lg:flex-col flex items-center gap-4">
            {config.onSearch && (
              <SearchInput
                value={value}
                onChange={handleChangeSearch}
                placeholder={config.placeholder || 'Search...'}
              />
            )}
            {config.enableDateRange && (
              <DateRangePicker
                onChange={config.onDateRangeChange}
                className="min-w-[240px] rounded-full"
                quickSelectionMode="past"
                constraintChooseDate={false}
              />
            )}
          </div>
          <div className="relative flex flex-row-reverse gap-4">
            {/* Menu icon only display on the mobile */}
            <MenuIcon
              onOpenMenuClick={onOpenMenuClick}
              onMobileSidebarOpen={onMobileSidebarOpen}
            />
            {/* <Icon
              src="/icon-image/avatar-1.png"
              alt="avatar"
              className="transition-transform duration-300 ease-in-out hover:scale-120"
              contentTooltip="User Avatar"
            /> */}
            <HeaderAvatarDropdown
              user={user}
              logout={logout}
              isLoading={isLoading}
            />

            <NotificationBell
              count={5}
              className="transition-transform duration-300 ease-in-out hover:scale-110"
            />

            {/* <Icon
              src="/icon-image/sun-moon.png"
              alt="Toggle theme mode"
              className="transition-transform duration-300 ease-in-out hover:scale-110"
              contentTooltip="Toggle theme mode"
            /> */}
            <div className="max-tablet:hidden">
              <ThemeDropdown />
            </div>
            <div className="max-tablet:hidden -mr-4">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>
      <div className="max-tablet:flex max-tablet:gap-4 hidden">
        <div
          className={`${config.enableDateRange ? 'min-w-[calc(50%-12px)]' : 'min-w-full'}`}
        >
          {config.onSearch && (
            <SearchInput
              value={value}
              onChange={handleChangeSearch}
              placeholder={config.placeholder || 'Search...'}
            />
          )}
        </div>
        <div className="min-w-[calc(50%-18px)]">
          {config.enableDateRange && (
            <DateRangePicker
              onChange={config.onDateRangeChange}
              numberOfMonths={1}
            />
          )}{' '}
        </div>
      </div>
    </header>
  );
};

export default Header;
