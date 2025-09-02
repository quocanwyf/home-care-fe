import { z } from 'zod';

// Helper function to convert time string to minutes
const timeToMinutes = (timeString: string): number => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};

// Helper function to check if time2 is at least 2 hours after time1
const isMinimumTwoHoursApart = (
  startTime: string,
  endTime: string
): boolean => {
  if (!startTime || !endTime) return false;

  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);

  // Handle case where end time is next day
  const adjustedEndMinutes =
    endMinutes < startMinutes ? endMinutes + 24 * 60 : endMinutes;

  return adjustedEndMinutes - startMinutes >= 120; // At least 2 hours
};

// Helper function to check if time is after another time (at least 30 minutes)
const isAfterTime = (laterTime: string, earlierTime: string): boolean => {
  if (!laterTime || !earlierTime) return false;

  const laterMinutes = timeToMinutes(laterTime);
  const earlierMinutes = timeToMinutes(earlierTime);

  return laterMinutes > earlierMinutes + 30; // At least 30 minutes after
};

// Helper function to check if time is before another time (at least 30 minutes)
const isBeforeTime = (earlierTime: string, laterTime: string): boolean => {
  if (!earlierTime || !laterTime) return false;

  const earlierMinutes = timeToMinutes(earlierTime);
  const laterMinutes = timeToMinutes(laterTime);

  return earlierMinutes < laterMinutes - 30; // At least 30 minutes before
};

export const systemFormSchema = z
  .object({
    // Company information
    companyName: z
      .string()
      .min(1, 'Company name is required')
      .transform((val) => val.trim().replace(/\s+/g, ' '))
      .refine((val) => val.length > 0, 'Company name cannot be empty')
      .refine(
        (val) => val.length >= 2,
        'Company name must be at least 2 characters'
      ),

    companyEmail: z
      .string()
      .min(1, 'Company email is required')
      .email('Please enter a valid email address')
      .transform((val) => val.trim()),

    companyPhone: z
      .string()
      .min(1, 'Company phone is required')
      .transform((val) => val.trim())
      .refine(
        (val) => /^\d+$/.test(val),
        'Phone number must contain only digits'
      )
      .refine(
        (val) => val.length === 10,
        'Phone number must be exactly 10 digits'
      )
      .refine((val) => val.startsWith('0'), 'Phone number must start with 0')
      .refine(
        (val) => /^0[1-9]\d{8}$/.test(val),
        'Invalid Vietnamese phone number format'
      ),

    companyAddress: z
      .string()
      .min(1, 'Company address is required')
      .transform((val) => val.trim().replace(/\s+/g, ' '))
      .refine((val) => val.length > 0, 'Company address cannot be empty')
      .refine(
        (val) => val.length >= 5,
        'Company address must be at least 5 characters'
      ),

    // Business settings
    baseSalary: z
      .number()
      .min(1, 'Base salary must be greater than 0')
      .max(1000000000, 'Base salary cannot exceed 1,000,000,000 VND'),

    // Operating hours
    openHour: z.string().min(1, 'Opening hour is required'),
    closeHour: z.string().min(1, 'Closing hour is required'),
    officeStartTime: z.string().min(1, 'Office start time is required'),
    officeEndTime: z.string().min(1, 'Office end time is required'),
  })
  .refine((data) => isMinimumTwoHoursApart(data.openHour, data.closeHour), {
    message: 'Closing hour must be at least 2 hours after opening hour',
    path: ['closeHour'],
  })
  .refine((data) => isAfterTime(data.officeStartTime, data.openHour), {
    message: 'Office start time must be after opening hour',
    path: ['officeStartTime'],
  })
  .refine((data) => isBeforeTime(data.officeEndTime, data.closeHour), {
    message: 'Office end time must be before closing hour',
    path: ['officeEndTime'],
  })
  .refine(
    (data) => isMinimumTwoHoursApart(data.officeStartTime, data.officeEndTime),
    {
      message:
        'Office end time must be at least 2 hours after office start time',
      path: ['officeEndTime'],
    }
  );

export type SystemFormData = z.infer<typeof systemFormSchema>;
