import { useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';

interface HelperStatusChangeEvent {
  helper_id: string;
  workingStatus: string;
  timestamp: string;
}

export const useHelperRealTime = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleHelperStatusChange = (
      event: CustomEvent<HelperStatusChangeEvent>
    ) => {
      const { helper_id, workingStatus } = event.detail;

      console.log('Updating helper:', { helper_id, workingStatus });

      // Loop qua tất cả helpers queries và update
      queryClient
        .getQueryCache()
        .getAll()
        .forEach((query) => {
          if (query.queryKey[0] === 'helpers') {
            queryClient.setQueryData(query.queryKey, (oldData: any) => {
              if (!oldData) return oldData;

              // Nếu data có structure { helpers: [...] }
              if (oldData.helpers && Array.isArray(oldData.helpers)) {
                return {
                  ...oldData,
                  helpers: oldData.helpers.map((helper: any) => {
                    if (helper._id === helper_id) {
                      console.log(
                        `Updated helper ${helper._id} status to ${workingStatus}`
                      );
                      return { ...helper, workingStatus };
                    }
                    return helper;
                  }),
                };
              }

              // Nếu data là array trực tiếp
              if (Array.isArray(oldData)) {
                return oldData.map((helper: any) => {
                  if (helper._id === helper_id) {
                    console.log(
                      `Updated helper ${helper._id} status to ${workingStatus}`
                    );
                    return { ...helper, workingStatus };
                  }
                  return helper;
                });
              }

              return oldData;
            });
          }
        });
    };

    window.addEventListener(
      'helperStatusChanged',
      handleHelperStatusChange as EventListener
    );

    return () => {
      window.removeEventListener(
        'helperStatusChanged',
        handleHelperStatusChange as EventListener
      );
    };
  }, [queryClient]);
};
