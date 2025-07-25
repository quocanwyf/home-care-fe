import { loginApi } from '@/apis/login.api';
import { MESSAGES_AUTH } from '@/constants/messages/messages-auth';
import type { LoginRequest } from '@/types/auth';
import { useMutation } from '@tanstack/react-query';

import { useToast } from '../common/useToast';

export const useLogin = () => {
  const { showSuccess, showError } = useToast();
  return useMutation({
    mutationFn: (credentials: LoginRequest) => loginApi(credentials),
    onSuccess: (data) => {
      console.log('Login successful:', data);
      showSuccess(MESSAGES_AUTH.LOGIN_SUCCESS);
    },

    onError: (error: Error) => {
      showError(MESSAGES_AUTH.LOGIN_FAILED + error.message);
    },
  });
};
