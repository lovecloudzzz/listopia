import { FiltersModule } from '@common/filters/filters.module';
import { GuardsModule } from '@common/guards/guards.module';
import { UtilsModule } from '@common/utils/utils.module';
import { AuthModule } from '@modules/auth/auth.module';
import { ContentModule } from '@modules/content/content.module';
import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { PrismaModule } from '@prismaPath/prisma.module';
import { AppConfigModule } from './config/app-config.module';
import { MiddlewareModule } from './middleware/middleware.module';
import { TaskRunnersModule } from './task-runners/task-runners.module';

@Module({
  imports: [
    GuardsModule,
    UtilsModule,
    PrismaModule,
    AuthModule,
    UserModule,
    ContentModule,
    AppConfigModule,
    MiddlewareModule,
    FiltersModule,
    TaskRunnersModule,
  ],
})
export class AppModule {}
