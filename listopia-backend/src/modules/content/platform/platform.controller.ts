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
import { PlatformService } from './platform.service';
import { Platform } from '@prisma/client';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/guards/roles.decorator';
import { GetPlatformsDto } from '@modules/content/platform/dto/getPlatforms.dto';
import { CreatePlatformDto } from '@modules/content/platform/dto/createPlatform.dto';
import { UpdatePlatformDto } from '@modules/content/platform/dto/updatePlatformDto';

@Controller('platform')
export class PlatformController {
  constructor(private readonly platformService: PlatformService) {}

  @Get(':id')
  async getPlatform(@Param('id') id: number): Promise<Platform> {
    return this.platformService.getPlatform(id);
  }

  @Get()
  async getPlatforms(
    @Query() getPlatformsDto: GetPlatformsDto,
  ): Promise<Platform[]> {
    return this.platformService.getPlatforms(getPlatformsDto);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Post()
  async createPlatform(
    @Body() createPlatformDto: CreatePlatformDto,
  ): Promise<Platform> {
    return this.platformService.createPlatform(createPlatformDto);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Put(':id')
  async updatePlatform(
    @Body() updatePlatformDto: UpdatePlatformDto,
  ): Promise<Platform> {
    return this.platformService.updatePlatform(updatePlatformDto);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Delete(':id')
  async deletePlatform(@Param('id') id: number): Promise<Platform> {
    return this.platformService.deletePlatform(id);
  }
}
