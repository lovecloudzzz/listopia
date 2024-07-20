import { Roles } from '@common/guards/RolesGuard/roles.decorator';
import { RolesGuard } from '@common/guards/RolesGuard/roles.guard';
import type { CreatePublisherType } from '@modules/content/publisher/types/createPublisher.type';
import type { GetPublishersType } from '@modules/content/publisher/types/getPublishers.type';
import type { UpdatePublisherTypeWithoutId } from '@modules/content/publisher/types/updatePublisher.type';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Publisher } from '@prisma/client';
import { PublisherService } from './publisher.service';

@Controller('publisher')
export class PublisherController {
  constructor(private readonly publisherService: PublisherService) {}

  @Get(':id')
  async getPublisher(@Param('id') id: number): Promise<Publisher> {
    return this.publisherService.getPublisher(id);
  }

  @Get()
  async getPublishers(
    @Query() getPublishersData: GetPublishersType,
  ): Promise<Publisher[]> {
    return this.publisherService.getPublishers(getPublishersData);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Post()
  async createPublisher(
    @Body() createPublisherData: CreatePublisherType,
  ): Promise<Publisher> {
    return this.publisherService.createPublisher(createPublisherData);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Put(':id')
  async updatePublisher(
    @Body() updatePublisherData: UpdatePublisherTypeWithoutId,
    @Param('id') id: number,
  ): Promise<Publisher> {
    return this.publisherService.updatePublisher({
      ...updatePublisherData,
      id: id,
    });
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Delete(':id')
  async deletePublisher(@Param('id') id: number): Promise<Publisher> {
    return this.publisherService.deletePublisher(id);
  }
}
