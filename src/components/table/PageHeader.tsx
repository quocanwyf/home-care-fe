import { useAppNavigate } from '@/hooks/useAppNavigate';

import TooltipInfo from '../common/primitives/TooltipInfo';
import { Button } from '../ui/button';

const PageHeader = ({ pageHeaderTitle }: { pageHeaderTitle: string }) => {
  const navigateTo = useAppNavigate();
  const handleClick = () => {
    navigateTo('add', {
      toast: {
        type: 'success',
        message: 'Điều hướng thành công!',
      },
      delay: 500,
    });
  };

  return (
    <div className="my-4 flex items-center justify-between bg-gray-50">
      <div className="text-overlay-slider font-bold opacity-80">
        {pageHeaderTitle}
      </div>
      <TooltipInfo content="Add new item" side="bottom">
        <Button
          onClick={handleClick}
          className="max-mobile:mr-4 max-tablet:mr-8 max-desktop:mr-18 mx-20 cursor-pointer rounded-xl px-3 py-1 transition duration-500 ease-in-out hover:scale-105"
        >
          Add
        </Button>
      </TooltipInfo>
    </div>
  );
};

export default PageHeader;
