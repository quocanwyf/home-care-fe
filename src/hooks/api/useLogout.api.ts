import { logoutApi } from '@/apis/logout.api';
import { MESSAGES_AUTH } from '@/constants/messages/messages-auth';
import { useMutation } from '@tanstack/react-query';

import { useToast } from '../common/useToast';

export const useLogout = () => {
  const { showSuccess, showError } = useToast();
  return useMutation({
    mutationFn: () => logoutApi(),
    onSuccess: () => {
      showSuccess(MESSAGES_AUTH.LOGOUT_SUCCESS);
    },
    onError: (error: Error) => {
      showError(MESSAGES_AUTH.LOGOUT_FAILED + error.message);
    },
  });
};
