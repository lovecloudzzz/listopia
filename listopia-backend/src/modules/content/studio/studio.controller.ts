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
import { StudioService } from './studio.service';
import { Studio } from '@prisma/client';
import { RolesGuard } from '@common/guards/RolesGuard/roles.guard';
import { Roles } from '@common/guards/RolesGuard/roles.decorator';
import { GetStudiosDto } from '@modules/content/studio/dto/getStudios.dto';
import { CreateStudioDto } from '@modules/content/studio/dto/createStudio.dto';
import { UpdateStudioDto } from '@modules/content/studio/dto/updateStudioDto';

@Controller('studio')
export class StudioController {
  constructor(private readonly studioService: StudioService) {}

  @Get(':id')
  async getStudio(@Param('id') id: number): Promise<Studio> {
    return this.studioService.getStudio(id);
  }

  @Get()
  async getStudios(@Query() getStudiosDto: GetStudiosDto): Promise<Studio[]> {
    return this.studioService.getStudios(getStudiosDto);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Post()
  async createStudio(
    @Body() createStudioDto: CreateStudioDto,
  ): Promise<Studio> {
    return this.studioService.createStudio(createStudioDto);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Put(':id')
  async updateStudio(
    @Body() updateStudioDto: UpdateStudioDto,
  ): Promise<Studio> {
    return this.studioService.updateStudio(updateStudioDto);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Delete(':id')
  async deleteStudio(@Param('id') id: number): Promise<Studio> {
    return this.studioService.deleteStudio(id);
  }
}
