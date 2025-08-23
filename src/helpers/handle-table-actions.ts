export const handleView = ({
  navigateTo,
  path,
}: {
  navigateTo: (
    path: string,
    options?:
      | {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          state?: any;
          replace?: boolean | undefined;
          delay?: number | undefined;
          toast?:
            | {
                type?: 'success' | 'error' | 'info' | 'warning' | undefined;
                message: string;
              }
            | undefined;
        }
      | undefined
  ) => void;
  path: string;
}) => {
  console.log('Xem chi tiết');
  navigateTo(path, {
    toast: {
      type: 'success',
      message: 'Điều hướng thành công!',
    },
    delay: 1000,
  });
};
