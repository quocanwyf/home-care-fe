import { useCallback, useEffect, useMemo, useState } from 'react';

import { debounce } from 'lodash';

import Icon from '@/components/common/icons/ImageIcon';
import MenuIcon from '@/components/common/icons/MenuIcon';
import NotificationBell from '@/components/common/icons/NotificationBell';
import { useAuth } from '@/context/AuthContext';
import { useSearch } from '@/context/SearchContext';

import { HeaderAvatarDropdown } from '../common/dropdowns/HeaderAvatarDropdown';
import { DateRangePicker } from '../common/primitives/DateRangePicker';
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
  const { config } = useSearch();
  const [value, setValue] = useState('');
  const { user, logout, isLoading } = useAuth();
  console.log('Header user', user);
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
    <header className="flex flex-col gap-4 rounded-2xl px-2 py-4 shadow-md">
      <div className="flex items-center justify-between">
        <div className="ml-1 text-lg font-semibold text-white">
          {/* Full name - Role / {title} Page */}
          {user
            ? `${user.fullName} - ${user.role} / ${title} Page`
            : 'HomeCare'}
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

            <Icon
              src="/icon-image/sun-moon.png"
              alt="Toggle dark mode"
              className="transition-transform duration-300 ease-in-out hover:scale-110"
              contentTooltip="Toggle dark mode"
            />
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
