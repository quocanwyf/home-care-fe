import { MESSAGES_COMMON } from '@/constants/messages/messages-common';

export const checkPhoneRegex = (
  phone: string,
  showError: (message: string) => void
): boolean => {
  const phoneRegex = /^[0-9]{10,11}$/;
  if (!phoneRegex.test(phone.trim())) {
    showError(MESSAGES_COMMON.INVALID_PHONE_FORMAT);
    return false;
  }
  return true;
};
