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
import { DeveloperService } from './developer.service';
import { Developer } from '@prisma/client';
import { GetDevelopersDto } from '@modules/content/developer/dto/getDevelopers.dto';
import { CreateDeveloperDto } from '@modules/content/developer/dto/createDeveloper.dto';
import { RolesGuard } from '@common/guards/RolesGuard/roles.guard';
import { Roles } from '@common/guards/RolesGuard/roles.decorator';
import { UpdateDeveloperDto } from '@modules/content/developer/dto/updateDeveloperDto';

@Controller('developer')
export class DeveloperController {
  constructor(private readonly developerService: DeveloperService) {}

  @Get(':id')
  async getDeveloper(@Param('id') id: number): Promise<Developer> {
    return this.developerService.getDeveloper(id);
  }

  @Get()
  async getDevelopers(
    @Query() getDevelopersDto: GetDevelopersDto,
  ): Promise<Developer[]> {
    return this.developerService.getDevelopers(getDevelopersDto);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Post()
  async createDeveloper(
    @Body() createDeveloperDto: CreateDeveloperDto,
  ): Promise<Developer> {
    return this.developerService.createDeveloper(createDeveloperDto);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Put(':id')
  async updateDeveloper(
    @Body() updateDeveloperDto: UpdateDeveloperDto,
  ): Promise<Developer> {
    return this.developerService.updateDeveloper(updateDeveloperDto);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Delete(':id')
  async deleteDeveloper(@Param('id') id: number): Promise<Developer> {
    return this.developerService.deleteDeveloper(id);
  }
}
