export interface SystemSetting {
  openHour: string; // "06:00"
  closeHour: string; // "20:00"
  officeStartTime: string; // "08:00"
  officeEndTime: string; // "18:00"
  baseSalary: number; // 3000000
}

export type CoefficientOther = {
  _id?: string;
  title?: string;
  coefficientList: {
    deleted?: boolean; // Optional, used for deletion
    _id?: string;
    title: string;
    value?: number;
    description?: string | undefined;
    status?: 'active' | 'inactive';
  }[];
};

//   Helper to get active coefficients
export const getActiveCoefficients = (coefficientOther: CoefficientOther[]) => {
  const activeCoeffs = coefficientOther.coefficientList.filter(
    (coeff) => coeff.status === 'active'
  );

  return {
    overtime: activeCoeffs.find((c) => c.title.includes('giờ'))?.value || 1.3,
    weekend:
      activeCoeffs.find((c) => c.title.includes('cuối tuần'))?.value || 1.1,
    holiday: activeCoeffs.find((c) => c.title.includes('lễ'))?.value || 1.4,
  };
};

//   Helper to calculate OT hours
export const calculateOvertimeHours = (
  startTime: string, // "07:00"
  endTime: string, // "19:00"
  systemSetting: SystemSetting
) => {
  const start = parseTime(startTime);
  const end = parseTime(endTime);
  const officeStart = parseTime(systemSetting.officeStartTime);
  const officeEnd = parseTime(systemSetting.officeEndTime);

  let overtimeHours = 0;
  let officeHours = 0;

  //   Case 1: Work starts before office hours (6-8h)
  if (start < officeStart) {
    const earlyOTEnd = Math.min(end, officeStart);
    overtimeHours += (earlyOTEnd - start) / 60; // Convert minutes to hours
  }

  //   Case 2: Work during office hours (8-18h)
  const workOfficeStart = Math.max(start, officeStart);
  const workOfficeEnd = Math.min(end, officeEnd);
  if (workOfficeStart < workOfficeEnd) {
    officeHours += (workOfficeEnd - workOfficeStart) / 60;
  }

  //   Case 3: Work after office hours (18-20h)
  if (end > officeEnd) {
    const lateOTStart = Math.max(start, officeEnd);
    overtimeHours += (end - lateOTStart) / 60;
  }

  return {
    timeRange: `${startTime} - ${endTime}`,
    overtimeHours: Math.round(overtimeHours * 100) / 100, // Round to 2 decimals
    officeHours: Math.round(officeHours * 100) / 100,
    totalHours: Math.round(((end - start) / 60) * 100) / 100,
  };
};

export const checkDateRangeIsWeekend = (
  startDate: string,
  endDate: string
): boolean => {
  const start = parseDate(startDate);
  const end = parseDate(endDate);

  const currentDate = new Date(start);

  while (currentDate <= end) {
    // Check if weekend (Saturday or Sunday)
    if (isWeekend(currentDate)) {
      return true;
    }

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return false;
};

export const checkDateIsWeekend = (dateString: string): boolean => {
  const date = parseDate(dateString);
  return isWeekend(date);
};

//   Helper to parse time string to minutes
export const parseTime = (timeString: string): number => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};

export const parseDate = (dateString: string): Date => {
  const [day, month, year] = dateString.split('/').map(Number);
  return new Date(year, month - 1, day); // month is 0-indexed
};

//   Helper to check if date is weekend
export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday or Saturday
};

//   Helper to check if date is holiday
export const isVietnameseHoliday = (date: Date): boolean => {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const holidays = [
    { month: 1, day: 1 }, // New Year
    { month: 4, day: 30 }, // Liberation Day
    { month: 5, day: 1 }, // Labor Day
    { month: 9, day: 2 }, // Independence Day
    // Add more holidays
  ];

  return holidays.some(
    (holiday) => holiday.month === month && holiday.day === day
  );
};
