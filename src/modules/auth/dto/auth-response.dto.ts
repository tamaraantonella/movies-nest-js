import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';
import { createZodDto } from '@anatine/zod-nestjs';

export const AuthResponseSchema = extendApi(
  z.strictObject({
    accessToken: z.string(),
    email: z.string().email(),
  }),
);

export class AuthResponseDto extends createZodDto(AuthResponseSchema) {}
