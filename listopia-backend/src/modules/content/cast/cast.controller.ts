import { Roles } from '@common/guards/RolesGuard/roles.decorator';
import { RolesGuard } from '@common/guards/RolesGuard/roles.guard';
import type { CreateCastType } from '@modules/content/cast/types/createCast.type';
import type { GetCastType } from '@modules/content/cast/types/getCast.type';
import type {
  UpdateCastDataWithoutId,
  UpdateCastType,
} from '@modules/content/cast/types/updateCast.type';
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
import { BookCast, ContentType, GameCast, MovieCast } from '@prisma/client';
import { CastService } from './cast.service';

@Controller('casts')
export class CastController {
  constructor(private readonly castService: CastService) {}

  @Get()
  async getCast(
    @Query() getCastData: GetCastType,
  ): Promise<(BookCast | MovieCast | GameCast)[]> {
    return this.castService.getCast(getCastData);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Post()
  async createCast(
    @Body() createCastData: CreateCastType,
  ): Promise<BookCast | MovieCast | GameCast> {
    return this.castService.createCast(createCastData);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Post('array')
  async createCastByArray(
    @Body() createCastDatas: CreateCastType[],
  ): Promise<(BookCast | MovieCast | GameCast)[]> {
    return this.castService.createCastByArray(createCastDatas);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Put(':id')
  async updateCast(
    @Body() updateCastData: UpdateCastDataWithoutId,
    @Param('id') id: number,
  ): Promise<BookCast | MovieCast | GameCast> {
    return this.castService.updateCast({ ...updateCastData, id: id });
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Put('array')
  async updateCastByArray(
    @Body() updateCastDatas: UpdateCastType[],
  ): Promise<(BookCast | MovieCast | GameCast)[]> {
    return this.castService.updateCastByArray(updateCastDatas);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Delete(':contentType/:id')
  async deleteCast(
    @Param('id') id: number,
    @Param('contentType') contentType: ContentType,
  ): Promise<BookCast | MovieCast | GameCast> {
    return this.castService.deleteCast({ id: id, contentType: contentType });
  }
}
