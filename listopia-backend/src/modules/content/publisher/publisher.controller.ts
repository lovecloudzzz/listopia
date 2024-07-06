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
import { PublisherService } from './publisher.service';
import { Publisher } from '@prisma/client';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/guards/roles.decorator';
import { GetPublishersDto } from '@modules/content/publisher/dto/getPublishers.dto';
import { CreatePublisherDto } from '@modules/content/publisher/dto/createPublisher.dto';
import { UpdatePublisherDto } from '@modules/content/publisher/dto/updatePublisherDto';

@Controller('publisher')
export class PublisherController {
  constructor(private readonly publisherService: PublisherService) {}

  @Get(':id')
  async getPublisher(@Param('id') id: number): Promise<Publisher> {
    return this.publisherService.getPublisher(id);
  }

  @Get()
  async getPublishers(
    @Query() getPublishersDto: GetPublishersDto,
  ): Promise<Publisher[]> {
    return this.publisherService.getPublishers(getPublishersDto);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Post()
  async createPublisher(
    @Body() createPublisherDto: CreatePublisherDto,
  ): Promise<Publisher> {
    return this.publisherService.createPublisher(createPublisherDto);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Put(':id')
  async updatePublisher(
    @Body() updatePublisherDto: UpdatePublisherDto,
  ): Promise<Publisher> {
    return this.publisherService.updatePublisher(updatePublisherDto);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Delete(':id')
  async deletePublisher(@Param('id') id: number): Promise<Publisher> {
    return this.publisherService.deletePublisher(id);
  }
}
