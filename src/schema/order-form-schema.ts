import { z } from 'zod';

export const orderFormSchema = z.object({
  // Service information
  serviceTitle: z.string().min(1, 'Service must be selected'),
  serviceBasePrice: z
    .number()
    .min(0, 'Service base price must be non-negative'),
  coefficient_service: z
    .number()
    .min(0, 'Service coefficient must be non-negative'),
  coefficient_other: z
    .number()
    .min(0, 'Other coefficient must be non-negative')
    .default(1),
  coefficient_ot: z
    .number()
    .min(0, 'OT coefficient must be non-negative')
    .default(1),

  // Date and time
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  requestType: z.enum(['shortTerm', 'longTerm']).optional(),

  // Cost calculation
  totalCost: z.number().min(0, 'Total cost must be non-negative').default(0),
  detailCost: z.array(z.any()).default([]),

  // Customer information
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .transform((val) => val.trim().replace(/\s+/g, ' ')) // Normalize spaces
    .refine((val) => val.length > 0, 'Full name cannot be empty')
    .refine((val) => val.length >= 2, 'Full name must be at least 2 characters')
    .refine(
      (val) => !/^\s|\s$/.test(val),
      'Full name cannot start or end with spaces'
    ),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .transform((val) => val.trim()) // Remove spaces
    .refine((val) => /^\d+$/.test(val), 'Phone number must contain only digits')
    .refine(
      (val) => val.length === 10,
      'Phone number must be exactly 10 digits'
    )
    .refine((val) => val.startsWith('0'), 'Phone number must start with 0')
    .refine(
      (val) => /^0[1-9]\d{8}$/.test(val),
      'Invalid Vietnamese phone number format'
    ),
  address: z
    .string()
    .min(1, 'Address is required')
    .transform((val) => val.trim().replace(/\s+/g, ' ')) // Normalize spaces
    .refine((val) => val.length > 0, 'Address cannot be empty')
    .refine((val) => val.length >= 5, 'Address must be at least 5 characters')
    .refine(
      (val) => !/^\s|\s$/.test(val),
      'Address cannot start or end with spaces'
    ),

  // Location codes
  wardCode: z.string().min(1).default(''),
  districtCode: z.string().min(1).default(''),
  provinceCode: z.string().min(1).default(''),

  // Location names
  ward: z.string().min(1, 'Ward is required').default(''),
  district: z.string().min(1, 'District is required').default(''),
  province: z.string().min(1, 'Province is required').default(''),

  // Account status
  isCusHasAcc: z.boolean().default(false),
});

export type OrderFormData = z.infer<typeof orderFormSchema>;
