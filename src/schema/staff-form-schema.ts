import { z } from 'zod';

export const staffFormSchema = z.object({
  staff_id: z
    .string()
    .min(1, 'Staff ID is required')
    .min(3, 'Staff ID must be at least 3 characters'),

  fullName: z
    .string()
    .min(1, 'Full name is required')
    .min(2, 'Full name must be at least 2 characters')
    .transform((val) => val.trim().replace(/\s+/g, ' ')),

  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),

  birthDate: z
    .string()
    .min(1, 'Birth date is required')
    .refine((date) => {
      if (!date) return false;

      const birthDate = new Date(date);
      const today = new Date();

      // Check if date is valid
      if (isNaN(birthDate.getTime())) return false;

      // Check if date is in the future
      if (birthDate > today) return false;

      // Calculate age
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      // Check age range (13-100)
      return age >= 13 && age <= 100;
    }, 'Staff must be between 13 and 100 years old, and birth date cannot be in the future'),

  phone: z
    .string()
    .min(1, 'Phone is required')
    .transform((val) => val.trim())
    .refine((val) => /^\d+$/.test(val), 'Phone must contain only digits')
    .refine((val) => val.length === 10, 'Phone must be exactly 10 digits')
    .refine((val) => val.startsWith('0'), 'Phone must start with 0')
    .refine(
      (val) => /^0[1-9]\d{8}$/.test(val),
      'Invalid Vietnamese phone number format'
    ),

  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .transform((val) => val.trim())
    .refine(
      (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      'Email must be in valid format (example@domain.com)'
    ),

  birthPlace: z
    .string()
    .min(1, 'Birth place is required')
    .min(2, 'Birth place must be at least 2 characters')
    .transform((val) => val.trim()),

  salary: z
    .string()
    .min(1, 'Salary is required')
    .refine(
      (val) => !isNaN(Number(val.replace(/,/g, ''))),
      'Salary must be a number'
    )
    .refine(
      (val) => Number(val.replace(/,/g, '')) > 0,
      'Salary must be greater than 0'
    )
    .refine(
      (val) => Number(val.replace(/,/g, '')) <= 1000000000,
      'Salary cannot exceed 1,000,000,000 VND'
    ),

  role: z.object({
    label: z.string().min(1, 'Role is required'),
    value: z.string().min(1, 'Role is required'),
  }),

  status: z.object({
    label: z.string().min(1, 'Status is required'),
    value: z.enum(['active', 'inactive']),
  }),
});

export type StaffFormData = z.infer<typeof staffFormSchema>;
