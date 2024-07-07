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
import { FranchiseService } from './franchise.service';
import { Franchise } from '@prisma/client';
import { GetFranchisesDto } from '@modules/content/franchise/dto/getFranchises.dto';
import { CreateFranchiseDto } from '@modules/content/franchise/dto/createFranchise.dto';
import { RolesGuard } from '@common/guards/RolesGuard/roles.guard';
import { Roles } from '@common/guards/RolesGuard/roles.decorator';
import { UpdateFranchiseDto } from '@modules/content/franchise/dto/updateFranchiseDto';

@Controller('franchise')
export class FranchiseController {
  constructor(private readonly franchiseService: FranchiseService) {}

  @Get(':id')
  async getFranchise(@Param('id') id: number): Promise<Franchise> {
    return this.franchiseService.getFranchise(id);
  }

  @Get()
  async getFranchises(
    @Query() getFranchisesDto: GetFranchisesDto,
  ): Promise<Franchise[]> {
    return this.franchiseService.getFranchises(getFranchisesDto);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Post()
  async createFranchise(
    @Body() createFranchiseDto: CreateFranchiseDto,
  ): Promise<Franchise> {
    return this.franchiseService.createFranchise(createFranchiseDto);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Put(':id')
  async updateFranchise(
    @Body() updateFranchiseDto: UpdateFranchiseDto,
  ): Promise<Franchise> {
    return this.franchiseService.updateFranchise(updateFranchiseDto);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Delete(':id')
  async deleteFranchise(@Param('id') id: number): Promise<Franchise> {
    return this.franchiseService.deleteFranchise(id);
  }
}
