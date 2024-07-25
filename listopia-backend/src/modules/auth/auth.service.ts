import type { LoginType } from '@modules/auth/types/login.type';
import type { LogoutType } from '@modules/auth/types/logout.type';
import type { RefreshTokenType } from '@modules/auth/types/refresh-token.type';
import type { RegisterType } from '@modules/auth/types/register.type';
import type { UserPayload } from '@modules/auth/types/user-payload.type';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from '@prismaPath/prisma.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(usernameOrEmail: string, password: string): Promise<User> {
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

  async login(loginData: LoginType) {
    const { usernameOrEmail, password } = loginData;
    const user = await this.validateUser(usernameOrEmail, password);
    if (!user) {
      throw new Error('User not found');
    }
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });
    const payload: UserPayload = {
      id: user.id,
      username: user.username,
      role: user.role,
      ...(user.avatarPath && { avatar: user.avatarPath }),
      ...(user.profileName && { profileName: user.profileName }),
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

  async register(registerData: RegisterType) {
    const { email, password, username } = registerData;
    if (!email || !password || !username) {
      throw new Error('All fields are required');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    await this.prisma.user.create({
      data: {
        email: email,
        passwordHash: passwordHash,
        username: username,
        profileName: username,
      },
    });
    const loginData: LoginType = { usernameOrEmail: email, password: password };
    return this.login(loginData);
  }

  async refreshToken(refreshTokenData: RefreshTokenType) {
    const { refreshToken } = refreshTokenData;
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
      id: user.id,
      username: user.username,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: newRefreshToken,
    };
  }

  async logout(logoutData: LogoutType) {
    const { userId, refreshToken } = logoutData;

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
