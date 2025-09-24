import Icon from '@/components/common/icons/ImageIcon';
import { headerAvatarOptions } from '@/constants/dropdown/header-avatar-options';
import { useLanguage } from '@/context/LanguageContext';
import { handleUserMenuSelect } from '@/helpers/handle-header-avatar-select';
import type { User } from '@/types/auth';

import AppDropdown from './AppDropdown';

export const HeaderAvatarDropdown = ({
  user,
  logout,
  isLoading = false,
}: {
  user: User | null;
  logout: () => Promise<void>;
  isLoading?: boolean;
}) => {
  const { t } = useLanguage();
  const customLabel = (
    <div className="flex items-center gap-2">
      <Icon
        src="/icon-image/avatar-1.png"
        alt="avatar small"
        className="h-6 w-6 rounded-full"
      />
      <span className="text-sm font-semibold">
        {user?.fullName + ' - ' + user?.role || t('header.userMenu')}
      </span>
    </div>
  );
  return (
    <AppDropdown
      options={headerAvatarOptions}
      onSelect={(option) => handleUserMenuSelect(option, logout)}
      triggerClassName={`!p-0 !border-none  ${
        isLoading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      showIcon={false}
      label={customLabel}
      minWidth=""
      disabled={isLoading}
      useAutoWidth={false}
      className="max-tablet:-right-20 absolute -right-10 z-50 w-52 rounded-md border border-gray-200 bg-white shadow-2xl"
      classNameItem="  px-4 py-2 text-sm hover:bg-tab-hover"
    >
      <Icon
        src="/icon-image/avatar-1.png"
        alt="avatar"
        className={`cursor-pointer transition-transform duration-300 ease-in-out hover:scale-120 ${
          isLoading ? 'cursor-not-allowed opacity-50' : ''
        }`}
        contentTooltip={
          isLoading ? 'Processing...' : user?.fullName || t('header.userMenu')
        }
      />
    </AppDropdown>
  );
};
