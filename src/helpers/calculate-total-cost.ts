import { isWeekend, parseDate } from './detect-ot-and-coefficients';

export interface DailyCostDetail {
  date: string; // "dd-mm-yyyy" format
  cost: number;
  // breakdown: {
  //   isWeekend: boolean;
  //   overtimeHours: number;
  //   officeHours: number;
  //   totalHours: number;
  //   baseCost: number;
  //   finalCost: number;
  // };
}

export interface TotalCostResult {
  totalCost: number;
  detailCost: DailyCostDetail[];
  // summary: {
  //   totalDays: number;
  //   weekendDays: number;
  //   normalDays: number;
  // };
}

export interface CostCalculationData {
  hoursBreakdown: {
    timeRange: string;
    overtimeHours: number;
    officeHours: number;
    totalHours: number;
  };
  activeCoeffs: {
    overtime: number;
    weekend: number;
    holiday: number;
  };
  formData: {
    serviceTitle: string;
    serviceBasePrice: number;
    coefficient_service: number;
    coefficient_other: number;
    coefficient_ot: number;
    startDate: string; // "dd/mm/yyyy"
    endDate: string; // "dd/mm/yyyy"
    startTime: string;
    endTime: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
}

//   Helper: Format date to dd-mm-yyyy
const formatDateForOutput = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export const calculateTotalCost = (
  data: CostCalculationData
): TotalCostResult => {
  if (!data) {
    return {
      totalCost: 0,
      detailCost: [],
      // summary: {
      //   totalDays: 0,
      //   weekendDays: 0,
      //   normalDays: 0,
      // },
    };
  }

  if (!data.hoursBreakdown || !data.activeCoeffs || !data.formData) {
    console.warn('Missing required data for cost calculation:', data);
    return {
      totalCost: 0,
      detailCost: [],
      // summary: {
      //   totalDays: 0,
      //   weekendDays: 0,
      //   normalDays: 0,
      // },
    };
  }
  const { hoursBreakdown, formData } = data;

  const {
    serviceBasePrice,
    coefficient_service,
    coefficient_other,
    coefficient_ot,
    startDate,
    endDate,
  } = formData;

  const start = parseDate(startDate);
  const end = parseDate(endDate);

  const detailCost: DailyCostDetail[] = [];
  let totalCost = 0;
  // let totalDays = 0;
  // let weekendDays = 0;
  // let normalDays = 0;
  let dailyCostT1 = 0; //OT and WeeekendOT
  let dailyCostT2 = 0; //Weekend and normal (without OT)

  //   Iterate through each day in the range
  const currentDate = new Date(start);

  while (currentDate <= end) {
    // totalDays++;
    const isWeekendDay = isWeekend(currentDate);

    // if (isWeekendDay) {
    //   weekendDays++;
    // } else {
    //   normalDays++;
    // }

    //  Calculate cost for this day
    const baseCost = serviceBasePrice * coefficient_service;

    //if weekend then nhân hs weekend dô
    if (isWeekendDay) {
      dailyCostT1 =
        coefficient_ot * hoursBreakdown.overtimeHours * coefficient_other;
      dailyCostT2 = coefficient_other * hoursBreakdown.officeHours;
    } else {
      //if k có weekend then  khỏi nhân hs weekend dô
      dailyCostT1 = coefficient_ot * hoursBreakdown.overtimeHours;
      dailyCostT2 = hoursBreakdown.officeHours;
    }
    //   Calculate final cost
    const dailyCost = baseCost * (dailyCostT1 + dailyCostT2);

    totalCost += dailyCost;

    //  Add to detail cost array
    detailCost.push({
      date: formatDateForOutput(currentDate),
      cost: Math.round(dailyCost),
      // breakdown: {
      //   isWeekend: isWeekendDay,
      //   overtimeHours: hoursBreakdown.overtimeHours,
      //   officeHours: hoursBreakdown.officeHours,
      //   totalHours: hoursBreakdown.totalHours,
      //   baseCost: baseCost,
      //   finalCost: Math.round(dailyCost),
      // },
    });

    //  Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return {
    totalCost: Math.round(totalCost),
    detailCost,
    // summary: {
    //   totalDays,
    //   weekendDays,
    //   normalDays,
    // },
  };
};

//   Simplified calculation function for your specific data
export const calculateOrderCost = (
  calculationData: CostCalculationData
): TotalCostResult => {
  return calculateTotalCost(calculationData);
};
