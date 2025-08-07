export const handleUserMenuSelect = async (
  option: {
    label: string;
    value: string | number;
  },
  logout: () => Promise<void>
) => {
  switch (option.value) {
    case 'profile':
      console.log('Navigate to profile page');
      break;
    case 'settings':
      console.log('Navigate to settings page');
      break;
    case 'logout':
      await logout();
      break;
    default:
      break;
  }
};
