import { CircleDollarSign } from 'lucide-react';

import CostSummaryCard from '@/components/common/card/CostSummaryCard';

const TotalOrderArea = () => {
  return (
    <>
      {/* Vùng khách hàng */}
      <div className="bg-overlay-slider/8 shadow-around my-6 w-full rounded-md px-4 pt-2 pb-4">
        {/* TITLE */}
        <div className="text-overlay-slider mx-2 mt-4 mb-5 flex flex-row items-center font-bold">
          <CircleDollarSign className="-mt-1 mr-2 h-5 w-5" />
          <p className="text-sm">TOTAL COST</p>
        </div>
        <div className="flex-1">
          <CostSummaryCard />
        </div>
      </div>
    </>
  );
};

export default TotalOrderArea;
