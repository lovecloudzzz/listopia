import { Roles } from '@common/guards/RolesGuard/roles.decorator';
import { RolesGuard } from '@common/guards/RolesGuard/roles.guard';
import type { CreateDeveloperType } from '@modules/content/developer/types/createDeveloper.type';
import type { GetDevelopersType } from '@modules/content/developer/types/getDevelopers.type';
import type { UpdateDeveloperTypeWithoutId } from '@modules/content/developer/types/updateDeveloper.type';
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
import { Developer } from '@prisma/client';
import { DeveloperService } from './developer.service';

@Controller('developer')
export class DeveloperController {
  constructor(private readonly developerService: DeveloperService) {}

  @Get(':id')
  async getDeveloper(@Param('id') id: number): Promise<Developer> {
    return this.developerService.getDeveloper(id);
  }

  @Get()
  async getDevelopers(
    @Query() getDevelopersData: GetDevelopersType,
  ): Promise<Developer[]> {
    return this.developerService.getDevelopers(getDevelopersData);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Post()
  async createDeveloper(
    @Body() createDeveloperData: CreateDeveloperType,
  ): Promise<Developer> {
    return this.developerService.createDeveloper(createDeveloperData);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Put(':id')
  async updateDeveloper(
    @Body() updateDeveloperData: UpdateDeveloperTypeWithoutId,
    @Param('id') id: number,
  ): Promise<Developer> {
    return this.developerService.updateDeveloper({
      ...updateDeveloperData,
      id: id,
    });
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Delete(':id')
  async deleteDeveloper(@Param('id') id: number): Promise<Developer> {
    return this.developerService.deleteDeveloper(id);
  }
}
