import type { z } from 'zod';

import type { systemFormSchema } from '@/schema/system-form-schema';

export type SystemFormData = z.infer<typeof systemFormSchema>;
