import { useMediaQuery } from 'react-responsive';

export const useIsTabletOrMobile = (): boolean => {
  return useMediaQuery({ maxWidth: 1024 });
};
