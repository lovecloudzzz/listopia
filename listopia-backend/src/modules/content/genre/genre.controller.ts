import { Roles } from '@common/guards/RolesGuard/roles.decorator';
import { RolesGuard } from '@common/guards/RolesGuard/roles.guard';
import type { CreateGenreType } from '@modules/content/genre/types/createGenre.type';
import type { UpdateGenreTypeWithoutId } from '@modules/content/genre/types/updateGenre.type';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ContentType } from '@prisma/client';
import { GenreService } from './genre.service';

@Controller('genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Post()
  async createGenre(@Body() createGenreData: CreateGenreType) {
    return this.genreService.createGenre(createGenreData);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Put(':id')
  async updateGenre(
    @Body() updateGenreData: UpdateGenreTypeWithoutId,
    @Param('id') id: number,
  ) {
    return this.genreService.updateGenre({ ...updateGenreData, id: id });
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Delete(':id')
  async deleteGenre(@Param('id') id: number) {
    return this.genreService.deleteGenre(id);
  }

  @Get()
  async getAllGenres() {
    return this.genreService.getAllGenres();
  }

  @Get(':genreType')
  async getGenresByType(@Param('genreType') genreType: ContentType) {
    return this.genreService.getGenresByType(genreType);
  }
}
