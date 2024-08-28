import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';
import { Role } from '@prisma/client';

export const CreateUserSchema = extendApi(z.strictObject({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string(),
  role: z.nativeEnum(Role),
}));

export class CreateUserDto extends createZodDto(CreateUserSchema) {
}
