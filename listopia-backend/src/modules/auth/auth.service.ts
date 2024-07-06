import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@prismaPath/prisma.service';

import { UserPayload } from './interfaces/user-payload.interface';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { LogoutDto } from '@modules/auth/dto/logout.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(usernameOrEmail: string, password: string): Promise<any> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      },
    });
    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      return user;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const { usernameOrEmail, password } = loginDto;
    const user = await this.validateUser(usernameOrEmail, password);
    if (!user) {
      throw new Error('User not found');
    }
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });
    const payload: UserPayload = {
      username: user.username,
      sub: user.id,
      role: user.role,
    };
    const refreshToken = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
        active: true,
      },
    });
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: refreshToken,
    };
  }

  async register(registerDto: RegisterDto) {
    const { email, password, username } = registerDto;
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    return this.prisma.user.create({
      data: {
        email: email,
        passwordHash: passwordHash,
        username: username,
        profileName: username,
      },
    });
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;
    const token = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });
    if (!token || !token.active || token.expiresAt < new Date()) {
      throw new Error('Invalid refresh token');
    }

    await this.prisma.refreshToken.update({
      where: { token: refreshToken },
      data: { active: false },
    });

    const newRefreshToken = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: token.userId,
        expiresAt,
        active: true,
      },
    });

    const user = await this.prisma.user.findUnique({
      where: { id: token.userId },
    });
    if (!user) {
      throw new Error('User not found');
    }
    const payload: UserPayload = {
      username: user.username,
      sub: user.id,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: newRefreshToken,
    };
  }

  async logout(logoutDto: LogoutDto) {
    const { userId, refreshToken } = logoutDto;

    const token = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!token || token.userId !== userId) {
      throw new Error('Invalid refresh token');
    }

    await this.prisma.refreshToken.delete({
      where: { token: refreshToken },
    });

    return { message: 'Logged out successfully' };
  }
}
