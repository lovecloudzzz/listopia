import { Roles } from '@common/decorators/roles.decorator';
import { RolesGuard } from '@common/guards/RolesGuard/roles.guard';
import {
  BadRequestException,
  Controller,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ContentType } from '@prisma/client';
import { AverageRatingService } from './average-rating.service';

@Controller('average-rating')
export class AverageRatingController {
  constructor(private readonly averageRatingService: AverageRatingService) {}

  @Post(':contentType')
  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer')
  async runManualUpdate(@Param('contentType') contentType: ContentType) {
    if (!Object.values(ContentType).includes(contentType)) {
      throw new BadRequestException(`Invalid content type: ${contentType}`);
    }

    await this.averageRatingService.runManualUpdate(contentType);
    return { message: 'Ratings updated successfully' };
  }
}
