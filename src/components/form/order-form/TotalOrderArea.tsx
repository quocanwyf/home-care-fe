import { useMemo } from 'react';

import { CircleDollarSign } from 'lucide-react';

import CostSummaryCard from '@/components/common/card/CostSummaryCard';
import type { CustomerAreaProps } from '@/types/params/order-params';

interface TotalOrderAreaProps {
  formData: CustomerAreaProps['formData'];
  onUpdateFormData: CustomerAreaProps['onUpdateFormData'];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  systemSetting?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  availableDiscounts?: any;
  coefficientOther?: number | undefined;
}

const TotalOrderArea = ({
  formData,
  onUpdateFormData,
  systemSetting,
  coefficientOther,
  availableDiscounts,
}: TotalOrderAreaProps) => {
  // const costCalculation = useMemo(() => {
  //   if (
  //     !formData.serviceBasePrice ||
  //     !formData.startTime ||
  //     !formData.endTime
  //   ) {
  //     return {
  //       serviceCost: 0,
  //       totalCost: 0,
  //       detailCost: [],
  //     };
  //   }

  //   // Calculate hours worked
  //   const startTime = new Date(`2024-01-01 ${formData.startTime}`);
  //   const endTime = new Date(`2024-01-01 ${formData.endTime}`);
  //   const hoursWorked =
  //     (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

  //   // Calculate days worked
  //   const startDate = new Date(formData.startDate);
  //   const endDate = new Date(formData.endDate);
  //   const daysWorked =
  //     Math.ceil(
  //       (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  //     ) + 1;

  //   // Calculate base cost per day
  //   const baseCostPerDay = formData.serviceBasePrice * hoursWorked;

  //   // Apply coefficients
  //   const serviceCostPerDay =
  //     baseCostPerDay *
  //     formData.coefficient_service *
  //     formData.coefficient_other *
  //     formData.coefficient_ot;

  //   const totalCost = serviceCostPerDay * daysWorked;

  //   // Generate detail cost breakdown
  //   const detailCost = [];
  //   for (let i = 0; i < daysWorked; i++) {
  //     const currentDate = new Date(startDate);
  //     currentDate.setDate(currentDate.getDate() + i);
  //     detailCost.push({
  //       date: currentDate.toISOString().split('T')[0],
  //       cost: Math.round(serviceCostPerDay),
  //     });
  //   }

  //   return {
  //     serviceCost: Math.round(serviceCostPerDay),
  //     totalCost: Math.round(totalCost),
  //     detailCost,
  //   };
  // }, [
  //   formData.serviceBasePrice,
  //   formData.startTime,
  //   formData.endTime,
  //   formData.startDate,
  //   formData.endDate,
  //   formData.coefficient_service,
  //   formData.coefficient_other,
  //   formData.coefficient_ot,
  // ]);

  // useMemo(() => {
  //   if (costCalculation.totalCost !== formData.totalCost) {
  //     onUpdateFormData({
  //       totalCost: costCalculation.totalCost,
  //       detailCost: costCalculation.detailCost,
  //     });
  //   }
  // }, [costCalculation, formData.totalCost, onUpdateFormData]);

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
          <CostSummaryCard
          // totalCost={formData.totalCost}
          // serviceCost={costCalculation.serviceCost}
          // detailCost={formData.detailCost}
          />
        </div>
      </div>
    </>
  );
};

export default TotalOrderArea;
