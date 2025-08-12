import { useNavigate } from 'react-router-dom';

import { useToast } from './useToast';

export function useAppNavigate<TState = undefined>() {
  const navigate = useNavigate();
  const { showSuccess, showError, showInfo, showWarning } = useToast();

  const navigateTo = (
    path: string,
    options?: {
      state?: TState;
      replace?: boolean;
      delay?: number;
      toast?: {
        type?: 'success' | 'error' | 'info' | 'warning';
        message: string;
      };
    }
  ) => {
    const {
      state,
      replace = false,
      delay = 0,
      toast: toastOption,
    } = options || {};

    if (toastOption?.message) {
      const { type = 'info', message } = toastOption;

      switch (type) {
        case 'success':
          showSuccess(message);
          break;
        case 'error':
          showError(message);
          break;
        case 'warning':
          showWarning(message);
          break;
        default:
          showInfo(message);
      }
    }

    const doNavigate = () => navigate(path, { state, replace });

    if (delay > 0) {
      setTimeout(doNavigate, delay);
    } else {
      doNavigate();
    }
  };

  return navigateTo;
}
