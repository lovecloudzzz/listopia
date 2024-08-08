import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { AverageRatingModule } from './average-rating/average-rating.module';

@Module({
  imports: [ScheduleModule.forRoot(), AverageRatingModule],
})
export class TaskRunnersModule {}
