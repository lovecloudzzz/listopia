import { Global, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RolesGuard } from '@common/guards/RolesGuard/roles.guard';
import { JwtAuthGuard } from '@common/guards/JWTGuard/jwt-auth.guard';

@Global()
@Module({
  providers: [RolesGuard, JwtAuthGuard, JwtService],
  exports: [RolesGuard, JwtAuthGuard, JwtService],
})
export class GuardsModule {}
