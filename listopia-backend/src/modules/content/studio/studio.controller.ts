import { Roles } from '@common/guards/RolesGuard/roles.decorator';
import { RolesGuard } from '@common/guards/RolesGuard/roles.guard';
import type { CreateStudioType } from '@modules/content/studio/types/createStudio.type';
import type { GetStudiosType } from '@modules/content/studio/types/getStudios.type';
import type { UpdateStudioTypeWithoutId } from '@modules/content/studio/types/updateStudio.type';
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
import { Studio } from '@prisma/client';
import { StudioService } from './studio.service';

@Controller('studio')
export class StudioController {
  constructor(private readonly studioService: StudioService) {}

  @Get(':id')
  async getStudio(@Param('id') id: number): Promise<Studio> {
    return this.studioService.getStudio(id);
  }

  @Get()
  async getStudios(@Query() getStudiosDto: GetStudiosType): Promise<Studio[]> {
    return this.studioService.getStudios(getStudiosDto);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Post()
  async createStudio(
    @Body() createStudioDto: CreateStudioType,
  ): Promise<Studio> {
    return this.studioService.createStudio(createStudioDto);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Put(':id')
  async updateStudio(
    @Body() updateStudioDto: UpdateStudioTypeWithoutId,
    @Param('id') id: number,
  ): Promise<Studio> {
    return this.studioService.updateStudio({ ...updateStudioDto, id: id });
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Delete(':id')
  async deleteStudio(@Param('id') id: number): Promise<Studio> {
    return this.studioService.deleteStudio(id);
  }
}
