import { MESSAGES_AUTH } from '@/constants/messages/messages-auth';
import type { User } from '@/types/auth';

export const checkAuthApi = async (): Promise<User> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/admin/auth/validate`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  );

  if (!response.ok) {
    throw new Error(MESSAGES_AUTH.UNAUTHORIZED_ACCESS);
  }

  return response.json();
};
