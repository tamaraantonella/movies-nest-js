import { extendApi } from '@anatine/zod-openapi';
import { createZodDto } from '@anatine/zod-nestjs';
import { CreateUserSchema } from '../../users/dto/create-user.dto';
import { z } from 'zod';
import { Role } from '@prisma/client';

export const RegisterSchema = extendApi(CreateUserSchema.merge(z.object({
  role: CreateUserSchema.shape.role.optional().default(Role.REGULAR)
})));

export class RegisterDto extends createZodDto(RegisterSchema) {
}