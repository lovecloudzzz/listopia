import { CastService } from '@modules/content/cast/cast.service';
import { FranchiseService } from '@modules/content/franchise/franchise.service';
import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';

@Module({
  controllers: [MovieController],
  providers: [MovieService, CastService, FranchiseService],
})
export class MovieModule {}
