import { MESSAGES_AUTH } from '@/constants/messages/messages-auth';
import type { LoginRequest, LoginResponse } from '@/types/auth';

export const loginApi = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  const url = `${import.meta.env.VITE_API_BASE_URL}/admin/auth/login`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorText = await response.text();

      if (
        response.status === 401 ||
        errorText.includes(MESSAGES_AUTH.NOT_CORRECT_CREDENTIALS)
      ) {
        throw new Error(MESSAGES_AUTH.NOT_CORRECT_CREDENTIALS);
      }

      throw new Error(MESSAGES_AUTH.SERVER_ERROR);
    }

    const data: LoginResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error(MESSAGES_AUTH.SERVER_ERROR);
  }
};
