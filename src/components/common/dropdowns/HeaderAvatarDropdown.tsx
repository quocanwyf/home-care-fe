import Icon from '@/components/common/icons/ImageIcon';
import { headerAvatarOptions } from '@/constants/dropdown/header-avatar-options';
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
  return (
    <AppDropdown
      options={headerAvatarOptions}
      onSelect={(option) => handleUserMenuSelect(option, logout)}
      triggerClassName={`!p-0 !border-none !bg-transparent hover:!bg-transparent ${
        isLoading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      showIcon={false}
      label={user?.fullName || 'User Menu'}
      disabled={isLoading}
    >
      <Icon
        src="/icon-image/avatar-1.png"
        alt="avatar"
        className={`cursor-pointer transition-transform duration-300 ease-in-out hover:scale-120 ${
          isLoading ? 'cursor-not-allowed opacity-50' : ''
        }`}
        contentTooltip={
          isLoading ? 'Processing...' : user?.fullName || 'User Menu'
        }
      />
    </AppDropdown>
  );
};
