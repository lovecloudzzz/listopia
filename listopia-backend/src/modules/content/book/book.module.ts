import { CastService } from '@modules/content/cast/cast.service';
import { FranchiseService } from '@modules/content/franchise/franchise.service';
import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';

@Module({
  controllers: [BookController],
  providers: [BookService, CastService, FranchiseService],
})
export class BookModule {}
