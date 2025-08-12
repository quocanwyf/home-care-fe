import { CircleUser, LogOut } from 'lucide-react';

export const headerAvatarOptions = [
  {
    label: 'Profile',
    value: 'profile',
    icon: <CircleUser />,
  },
  {
    label: 'Logout',
    value: 'logout',
    icon: <LogOut className="h-4 w-4" />,
  },
];
