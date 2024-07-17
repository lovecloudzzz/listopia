import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CastService } from './cast.service';
import { GetCastDto } from '@modules/content/cast/dto/getCast.dto';
import { CreateCastDto } from '@modules/content/cast/dto/createCast.dto';
import { UpdateCastDto } from '@modules/content/cast/dto/updateCast.dto';
import { DeleteCastDto } from '@modules/content/cast/dto/deleteCast.dto';
import { BookCast, GameCast, MovieCast } from '@prisma/client';

@Controller('casts')
export class CastController {
  constructor(private readonly castService: CastService) {}

  @Get()
  async getCast(
    @Query() getCastDto: GetCastDto,
  ): Promise<(BookCast | MovieCast | GameCast)[]> {
    return this.castService.getCast(getCastDto);
  }

  @Post()
  async createCast(
    @Body() createCastDto: CreateCastDto,
  ): Promise<BookCast | MovieCast | GameCast> {
    return this.castService.createCast(createCastDto);
  }

  @Post('array')
  async createCastByArray(
    @Body() createCastDtos: CreateCastDto[],
  ): Promise<(BookCast | MovieCast | GameCast)[]> {
    return this.castService.createCastByArray(createCastDtos);
  }

  @Put()
  async updateCast(
    @Body() updateCastDto: UpdateCastDto,
  ): Promise<BookCast | MovieCast | GameCast> {
    return this.castService.updateCast(updateCastDto);
  }

  @Put('array')
  async updateCastByArray(
    @Body() updateCastDtos: UpdateCastDto[],
  ): Promise<(BookCast | MovieCast | GameCast)[]> {
    return this.castService.updateCastByArray(updateCastDtos);
  }

  @Delete()
  async deleteCast(
    @Body() deleteCastDto: DeleteCastDto,
  ): Promise<BookCast | MovieCast | GameCast> {
    return this.castService.deleteCast(deleteCastDto);
  }
}
