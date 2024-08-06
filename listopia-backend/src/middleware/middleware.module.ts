import { Module } from '@nestjs/common';
import { VisitTrackingModule } from './visit-tracking/visit-tracking.module';

@Module({
  imports: [VisitTrackingModule],
})
export class MiddlewareModule {}
