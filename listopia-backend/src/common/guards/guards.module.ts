import { JwtAuthGuard } from '@common/guards/JWTGuard/jwt-auth.guard';
import { RolesGuard } from '@common/guards/RolesGuard/roles.guard';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Global()
@Module({
  providers: [RolesGuard, JwtAuthGuard, JwtService, ConfigService],
  exports: [RolesGuard, JwtAuthGuard, JwtService],
})
export class GuardsModule {}
