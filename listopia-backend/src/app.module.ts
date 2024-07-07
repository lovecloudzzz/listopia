import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@prismaPath/prisma.module';
import { ContentModule } from '@modules/content/content.module';
import { AuthModule } from '@modules/auth/auth.module';
import { UserModule } from '@modules/user/user.module';
import { UtilsModule } from '@common/utils/utils.module';
import { GuardsModule } from '@common/guards/guards.module';

@Module({
  imports: [
    GuardsModule,
    UtilsModule,
    PrismaModule,
    AuthModule,
    UserModule,
    ContentModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
})
export class AppModule {}
