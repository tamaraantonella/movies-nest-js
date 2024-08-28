import { SetMetadata } from '@nestjs/common';
import { ROLE_KEY } from '../../constants';
import { Role } from '@prisma/client';

export const RolesDecorator = (role: Role) => SetMetadata(ROLE_KEY, role);