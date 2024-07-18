import { JwtAuthGuard } from '@common/guards/JWTGuard/jwt-auth.guard';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const jwtAuthGuard = new JwtAuthGuard(this.jwtService, this.configService);
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
