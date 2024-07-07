import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserRole } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '@common/guards/JWTGuard/jwt-auth.guard';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const jwtAuthGuard = new JwtAuthGuard(this.jwtService);
    const canActivate = jwtAuthGuard.canActivate(context);

    if (!canActivate) {
      return false;
    }

    const roles = this.reflector.get<UserRole[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    const user = request.user;

    return roles.includes(user.role);
  }
}
