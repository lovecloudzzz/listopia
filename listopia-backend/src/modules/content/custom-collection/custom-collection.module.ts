import { Module } from '@nestjs/common';
import { CustomCollectionService } from './custom-collection.service';
import { CustomCollectionController } from './custom-collection.controller';

@Module({
  controllers: [CustomCollectionController],
  providers: [CustomCollectionService],
})
export class CustomCollectionModule {}
