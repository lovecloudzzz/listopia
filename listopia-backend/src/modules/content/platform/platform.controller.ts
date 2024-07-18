import { Roles } from '@common/guards/RolesGuard/roles.decorator';
import { RolesGuard } from '@common/guards/RolesGuard/roles.guard';
import type { CreatePlatformType } from '@modules/content/platform/types/createPlatform.type';
import type { GetPlatformsType } from '@modules/content/platform/types/getPlatforms.type';
import type { UpdatePlatformTypeWithoutId } from '@modules/content/platform/types/updatePlatform.type';
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
import { Platform } from '@prisma/client';
import { PlatformService } from './platform.service';

@Controller('platform')
export class PlatformController {
  constructor(private readonly platformService: PlatformService) {}

  @Get(':id')
  async getPlatform(@Param('id') id: number): Promise<Platform> {
    return this.platformService.getPlatform(id);
  }

  @Get()
  async getPlatforms(
    @Query() getPlatformsDto: GetPlatformsType,
  ): Promise<Platform[]> {
    return this.platformService.getPlatforms(getPlatformsDto);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Post()
  async createPlatform(
    @Body() createPlatformDto: CreatePlatformType,
  ): Promise<Platform> {
    return this.platformService.createPlatform(createPlatformDto);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Put(':id')
  async updatePlatform(
    @Body() updatePlatformDto: UpdatePlatformTypeWithoutId,
    @Param('id') id: number,
  ): Promise<Platform> {
    return this.platformService.updatePlatform({
      ...updatePlatformDto,
      id: id,
    });
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Delete(':id')
  async deletePlatform(@Param('id') id: number): Promise<Platform> {
    return this.platformService.deletePlatform(id);
  }
}
