import { Roles } from '@common/guards/RolesGuard/roles.decorator';
import { RolesGuard } from '@common/guards/RolesGuard/roles.guard';
import { CreateCastDto } from '@modules/content/cast/dto/createCast.dto';
import { DeleteCastDto } from '@modules/content/cast/dto/deleteCast.dto';
import { GetCastDto } from '@modules/content/cast/dto/getCast.dto';
import { UpdateCastDto } from '@modules/content/cast/dto/updateCast.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BookCast, GameCast, MovieCast } from '@prisma/client';
import { CastService } from './cast.service';

@Controller('casts')
export class CastController {
  constructor(private readonly castService: CastService) {}

  @Get()
  async getCast(
    @Query() getCastDto: GetCastDto,
  ): Promise<(BookCast | MovieCast | GameCast)[]> {
    return this.castService.getCast(getCastDto);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Post()
  async createCast(
    @Body() createCastDto: CreateCastDto,
  ): Promise<BookCast | MovieCast | GameCast> {
    return this.castService.createCast(createCastDto);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Post('array')
  async createCastByArray(
    @Body() createCastDtos: CreateCastDto[],
  ): Promise<(BookCast | MovieCast | GameCast)[]> {
    return this.castService.createCastByArray(createCastDtos);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Put()
  async updateCast(
    @Body() updateCastDto: UpdateCastDto,
  ): Promise<BookCast | MovieCast | GameCast> {
    return this.castService.updateCast(updateCastDto);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Put('array')
  async updateCastByArray(
    @Body() updateCastDtos: UpdateCastDto[],
  ): Promise<(BookCast | MovieCast | GameCast)[]> {
    return this.castService.updateCastByArray(updateCastDtos);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Delete()
  async deleteCast(
    @Body() deleteCastDto: DeleteCastDto,
  ): Promise<BookCast | MovieCast | GameCast> {
    return this.castService.deleteCast(deleteCastDto);
  }
}
