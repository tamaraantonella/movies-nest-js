import { applyDecorators, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { RolesDecorator } from './roles.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';

export const AuthDecorator = (role: Role) => {
  return applyDecorators(RolesDecorator(role), UseGuards(AuthGuard, RolesGuard
  ));
};