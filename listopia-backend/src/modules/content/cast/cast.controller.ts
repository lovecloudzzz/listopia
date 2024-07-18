import { Roles } from '@common/guards/RolesGuard/roles.decorator';
import { RolesGuard } from '@common/guards/RolesGuard/roles.guard';
import type { CreateCastType } from '@modules/content/cast/types/createCast.type';
import type { GetCastType } from '@modules/content/cast/types/getCast.type';
import type {
  UpdateCastDtoWithoutId,
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
    @Query() getCastDto: GetCastType,
  ): Promise<(BookCast | MovieCast | GameCast)[]> {
    return this.castService.getCast(getCastDto);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Post()
  async createCast(
    @Body() createCastDto: CreateCastType,
  ): Promise<BookCast | MovieCast | GameCast> {
    return this.castService.createCast(createCastDto);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Post('array')
  async createCastByArray(
    @Body() createCastDtos: CreateCastType[],
  ): Promise<(BookCast | MovieCast | GameCast)[]> {
    return this.castService.createCastByArray(createCastDtos);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Put(':id')
  async updateCast(
    @Body() updateCastDto: UpdateCastDtoWithoutId,
    @Param('id') id: number,
  ): Promise<BookCast | MovieCast | GameCast> {
    return this.castService.updateCast({ ...updateCastDto, id: id });
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Put('array')
  async updateCastByArray(
    @Body() updateCastDtos: UpdateCastType[],
  ): Promise<(BookCast | MovieCast | GameCast)[]> {
    return this.castService.updateCastByArray(updateCastDtos);
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
