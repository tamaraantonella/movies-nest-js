import { z } from 'zod';
import { extendApi } from '@anatine/zod-openapi';

export const EnvelopeSchema = <T>(dataSchema: z.ZodType<T>) =>
  extendApi(
    z.object({
      data: dataSchema,
      count: z.number().int(),
    }),
  );
