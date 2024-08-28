import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';
import { createZodDto } from '@anatine/zod-nestjs';

export const LoginSchema = extendApi(z.strictObject({
  email: z.string().email(),
  password: z.string().min(8).max(50),
}));

export class LoginDto extends createZodDto(LoginSchema) {
}