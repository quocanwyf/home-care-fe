import { z } from 'zod';

export const serviceFormSchema = z.object({
  // Service fields
  serviceTitle: z
    .string()
    .min(1, 'Service title is required')
    .min(3, 'Service title must be at least 3 characters')
    .transform((val) => val.trim()),

  basicPrice: z
    .string()
    .min(1, 'Basic price is required')
    .refine(
      (val) => !isNaN(Number(val.replace(/,/g, ''))),
      'Basic price must be a number'
    )
    .refine(
      (val) => Number(val.replace(/,/g, '')) > 0,
      'Basic price must be greater than 0'
    )
    .refine(
      (val) => Number(val.replace(/,/g, '')) <= 10000000000,
      'Basic price cannot exceed 10,000,000,000 VND'
    ),

  serviceDescription: z
    .string()
    .min(1, 'Service description is required')
    .min(10, 'Service description must be at least 10 characters')
    .transform((val) => val.trim()),

  serviceStatus: z.object({
    label: z.string().min(1, 'Service status is required'),
    value: z.enum(['active', 'inactive']),
  }),

  // Coefficient fields
  coefficientTitle: z
    .string()
    .min(1, 'Coefficient title is required')
    .min(3, 'Coefficient title must be at least 3 characters')
    .transform((val) => val.trim()),

  coefficientDescription: z
    .string()
    .min(1, 'Coefficient description is required')
    .min(5, 'Coefficient description must be at least 5 characters')
    .transform((val) => val.trim()),

  coefficientValue: z
    .string()
    .min(1, 'Coefficient value is required')
    .refine((val) => !isNaN(Number(val)), 'Coefficient value must be a number')
    .refine(
      (val) => Number(val) > 0,
      'Coefficient value must be greater than 0'
    )
    .refine((val) => Number(val) <= 10, 'Coefficient value cannot exceed 10'),
});

export type ServiceFormData = z.infer<typeof serviceFormSchema>;
