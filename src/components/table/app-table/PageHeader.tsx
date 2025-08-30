import { Plus } from 'lucide-react';

import { useAppNavigate } from '@/hooks/common/useAppNavigate';

import TooltipInfo from '../../common/primitives/TooltipInfo';
import { Button } from '../../ui/button';

const PageHeader = ({
  pageHeaderTitle,
  children,
  handleClick,
  showAddButton = true,
}: {
  pageHeaderTitle: string;
  children?: React.ReactNode;
  handleClick?: () => void;
  showAddButton?: boolean;
}) => {
  const navigateTo = useAppNavigate();

  const handleClickDefault = () => {
    navigateTo('add', {
      toast: {
        type: 'success',
        message: 'Điều hướng thành công!',
      },
      delay: 500,
    });
  };

  return (
    <div className="my-4 flex items-center justify-between">
      <div className="text-overlay-slider font-bold opacity-80">
        {pageHeaderTitle}
      </div>
      <div className="flex">
        {showAddButton && (
          <TooltipInfo content="Add new item" side="bottom">
            <Button
              onClick={handleClick ?? handleClickDefault}
              className="mx-4 cursor-pointer rounded-xl px-3 py-1 transition duration-500 ease-in-out hover:scale-105"
            >
              <div className="">Add</div>
              <Plus className="h-4 w-4" />
            </Button>
          </TooltipInfo>
        )}
        {children}
      </div>
    </div>
  );
};

export default PageHeader;
