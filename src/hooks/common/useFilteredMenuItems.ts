import { useMemo } from 'react';

import {
  MENU_ITEMS,
  type MenuItem,
} from '@/constants/mock-data/mock-data-sidebar';

import { usePermission } from './usePermission';

export const useFilteredMenuItems = () => {
  const { canView } = usePermission();

  const filteredMenuItems = useMemo(() => {
    const filterMenuItems = (items: MenuItem[]): MenuItem[] => {
      return items
        .map((item) => {
          // Nếu item có children, lọc children trước
          if (item.children) {
            const filteredChildren = item.children.filter((child) => {
              if (!child.permissionModule) return true; // Không cần permission
              const hasPermission = canView(child.permissionModule);

              return hasPermission;
            });

            // Nếu group có children sau khi filter, giữ lại group
            if (filteredChildren.length > 0) {
              return {
                ...item,
                children: filteredChildren,
              };
            }
            // Nếu không có children nào, ẩn cả group
            return null;
          }

          // Cho item không có children
          if (!item.permissionModule) return item; // Không cần permission (như Logout)

          const hasPermission = canView(item.permissionModule);

          return hasPermission ? item : null;
        })
        .filter((item): item is MenuItem => item !== null);
    };

    const filtered = filterMenuItems(MENU_ITEMS);
    return filtered;
  }, [canView]);

  return filteredMenuItems;
};
