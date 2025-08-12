import { MESSAGES_AUTH } from '@/constants/messages/messages-auth';

export const logoutApi = async (): Promise<void> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/admin/auth/logout`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  );

  if (!response.ok) {
    console.warn(MESSAGES_AUTH.LOGOUT_FAILED);
  }
};
