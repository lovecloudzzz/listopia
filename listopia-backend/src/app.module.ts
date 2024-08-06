import { HttpExceptionFilter } from '@common/filters/http-exception.filter';
import { GuardsModule } from '@common/guards/guards.module';
import { UtilsModule } from '@common/utils/utils.module';
import { AuthModule } from '@modules/auth/auth.module';
import { ContentModule } from '@modules/content/content.module';
import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { PrismaModule } from '@prismaPath/prisma.module';
import { MiddlewareModule } from './middleware/middleware.module';

@Module({
  imports: [
    GuardsModule,
    UtilsModule,
    PrismaModule,
    AuthModule,
    UserModule,
    ContentModule,
    MiddlewareModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MiddlewareModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
