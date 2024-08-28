import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { PUBLIC_KEY, ROLE_KEY } from '@/constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get<boolean>(
      PUBLIC_KEY,
      context.getHandler(),
    );
    if (isPublic) {
      return true;
    }
    const role =
      this.reflector.get<Role>(ROLE_KEY, context.getHandler()) ||
      this.reflector.get<Role>(ROLE_KEY, context.getClass());
    const { user } = context.switchToHttp().getRequest<Request>();
    return user.role === role;
  }
}
