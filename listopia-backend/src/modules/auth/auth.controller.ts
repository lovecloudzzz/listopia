import { JwtAuthGuard } from '@common/guards/JWTGuard/jwt-auth.guard';
import type { LoginType } from '@modules/auth/types/login.type';
import type { LogoutType } from '@modules/auth/types/logout.type';
import type { RefreshTokenType } from '@modules/auth/types/refresh-token.type';
import type { RegisterType } from '@modules/auth/types/register.type';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginType) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterType) {
    return this.authService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh-token')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenType) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Body('refreshToken') logoutDto: LogoutType) {
    return this.authService.logout(logoutDto);
  }
}
