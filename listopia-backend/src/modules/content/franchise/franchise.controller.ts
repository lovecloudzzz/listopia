import { Roles } from '@common/guards/RolesGuard/roles.decorator';
import { RolesGuard } from '@common/guards/RolesGuard/roles.guard';
import type { CreateFranchiseType } from '@modules/content/franchise/types/createFranchise.type';
import type { GetFranchisesType } from '@modules/content/franchise/types/getFranchises.type';
import type { UpdateFranchiseTypeWithoutId } from '@modules/content/franchise/types/updateFranchise.type';
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
import { Franchise } from '@prisma/client';
import { FranchiseService } from './franchise.service';

@Controller('franchise')
export class FranchiseController {
  constructor(private readonly franchiseService: FranchiseService) {}

  @Get(':id')
  async getFranchise(@Param('id') id: number): Promise<Franchise> {
    return this.franchiseService.getFranchise(id);
  }

  @Get()
  async getFranchises(
    @Query() getFranchisesData: GetFranchisesType,
  ): Promise<Franchise[]> {
    return this.franchiseService.getFranchises(getFranchisesData);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Post()
  async createFranchise(
    @Body() createFranchiseData: CreateFranchiseType,
  ): Promise<Franchise> {
    return this.franchiseService.createFranchise(createFranchiseData);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Put(':id')
  async updateFranchise(
    @Body() updateFranchiseData: UpdateFranchiseTypeWithoutId,
    @Param('id') id: number,
  ): Promise<Franchise> {
    return this.franchiseService.updateFranchise({
      ...updateFranchiseData,
      id: id,
    });
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Delete(':id')
  async deleteFranchise(@Param('id') id: number): Promise<Franchise> {
    return this.franchiseService.deleteFranchise(id);
  }
}
