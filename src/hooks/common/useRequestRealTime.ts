import { useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';

interface RequestStatusChangeEvent {
  request_id: string;
  status: string;
  timestamp: string;
}

export const useRequestRealTime = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleRequestStatusChange = (
      event: CustomEvent<RequestStatusChangeEvent>
    ) => {
      const { request_id, status } = event.detail;

      console.log('Updating request:', { request_id, status });

      // Loop qua tất cả requests queries và update
      queryClient
        .getQueryCache()
        .getAll()
        .forEach((query) => {
          if (
            query.queryKey[0] === 'orders' ||
            query.queryKey[0] === 'requests'
          ) {
            console.log('Found query:', query.queryKey, query.state.data);

            queryClient.setQueryData(query.queryKey, (oldData: any) => {
              console.log('Processing oldData:', oldData);

              if (!oldData) return oldData;

              // Check nếu có result array (structure từ API)
              if (oldData.result && Array.isArray(oldData.result)) {
                console.log('Updating result array');

                // Debug: Log structure của item đầu tiên
                console.log('First item structure:', oldData.result[0]);
                console.log(
                  'First item keys:',
                  Object.keys(oldData.result[0] || {})
                );

                return {
                  ...oldData,
                  result: oldData.result.map((item: any) => {
                    // Check với các field ID khác nhau
                    const isMatch =
                      item._id === request_id ||
                      item.id === request_id ||
                      item.orderId === request_id ||
                      item.request_id === request_id;

                    console.log(`Checking item:`, {
                      _id: item._id,
                      id: item.id,
                      orderId: item.orderId,
                      request_id: item.request_id,
                      looking_for: request_id,
                      match: isMatch,
                    });

                    if (isMatch) {
                      console.log(
                        `Found and updating item with ID ${request_id} from status ${item.status} to ${status}`
                      );
                      return { ...item, status };
                    }
                    return item;
                  }),
                };
              }

              console.log('No matching data structure found');
              return oldData;
            });
          }
        });
    };

    window.addEventListener(
      'requestStatusChanged',
      handleRequestStatusChange as EventListener
    );

    return () => {
      window.removeEventListener(
        'requestStatusChanged',
        handleRequestStatusChange as EventListener
      );
    };
  }, [queryClient]);
};
