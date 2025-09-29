import { useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';

interface RequestDetailStatusChangeEvent {
  requestDetail_id: string;
  status: string;
  helper: {
    helper_id: string;
    fullName: string;
  } | null;
  timestamp: string;
}

export const useRequestDetailRealTime = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleRequestDetailStatusChange = (
      event: CustomEvent<RequestDetailStatusChangeEvent>
    ) => {
      const { requestDetail_id, status, helper } = event.detail;

      console.log('Updating request detail:', {
        requestDetail_id,
        status,
        helper,
      });

      // Loop qua tất cả request details queries và update
      queryClient
        .getQueryCache()
        .getAll()
        .forEach((query) => {
          // Check cho request details queries
          if (
            query.queryKey[0] === 'order-detail' ||
            query.queryKey[0] === 'orderDetails' ||
            query.queryKey[0] === 'requestDetails' ||
            query.queryKey.some((key) => String(key).includes('detail'))
          ) {
            console.log(
              'Found detail query:',
              query.queryKey,
              query.state.data
            );

            queryClient.setQueryData(query.queryKey, (oldData: any) => {
              console.log('Processing detail oldData:', oldData);

              if (!oldData) return oldData;

              // Check nếu có requestDetails array
              if (
                oldData.requestDetails &&
                Array.isArray(oldData.requestDetails)
              ) {
                console.log('Updating requestDetails array');

                return {
                  ...oldData,
                  requestDetails: oldData.requestDetails.map((item: any) => {
                    // Check với các field ID khác nhau
                    const isMatch =
                      item._id === requestDetail_id ||
                      item.id === requestDetail_id ||
                      item.detailId === requestDetail_id ||
                      item.requestDetailId === requestDetail_id;

                    console.log(`Checking detail item:`, {
                      _id: item._id,
                      id: item.id,
                      detailId: item.detailId,
                      requestDetailId: item.requestDetailId,
                      looking_for: requestDetail_id,
                      match: isMatch,
                    });

                    if (isMatch) {
                      console.log(
                        `Found and updating detail ${requestDetail_id} from ${item.status} to ${status}`
                      );

                      // Update cả status và helper info nếu có
                      const updatedItem = { ...item, status };
                      if (helper) {
                        updatedItem.helper = helper;
                      }

                      return updatedItem;
                    }
                    return item;
                  }),
                };
              }

              // Check nếu có result array (fallback)
              if (oldData.result && Array.isArray(oldData.result)) {
                console.log('Updating detail result array');

                return {
                  ...oldData,
                  result: oldData.result.map((item: any) => {
                    const isMatch =
                      item._id === requestDetail_id ||
                      item.id === requestDetail_id ||
                      item.detailId === requestDetail_id ||
                      item.requestDetailId === requestDetail_id;

                    if (isMatch) {
                      console.log(
                        `Found and updating detail ${requestDetail_id} from ${item.status} to ${status}`
                      );

                      const updatedItem = { ...item, status };
                      if (helper) {
                        updatedItem.helper = helper;
                      }

                      return updatedItem;
                    }
                    return item;
                  }),
                };
              }

              // Nếu data là array trực tiếp
              if (Array.isArray(oldData)) {
                console.log('Updating direct detail array');
                return oldData.map((item: any) => {
                  const isMatch =
                    item._id === requestDetail_id ||
                    item.id === requestDetail_id ||
                    item.detailId === requestDetail_id ||
                    item.requestDetailId === requestDetail_id;

                  if (isMatch) {
                    console.log(
                      `Found and updating detail ${requestDetail_id} from ${item.status} to ${status}`
                    );

                    const updatedItem = { ...item, status };
                    if (helper) {
                      updatedItem.helper = helper;
                    }

                    return updatedItem;
                  }
                  return item;
                });
              }

              console.log('No matching detail data structure found');
              return oldData;
            });
          }
        });
    };

    window.addEventListener(
      'requestDetailStatusChanged',
      handleRequestDetailStatusChange as EventListener
    );

    return () => {
      window.removeEventListener(
        'requestDetailStatusChanged',
        handleRequestDetailStatusChange as EventListener
      );
    };
  }, [queryClient]);
};
