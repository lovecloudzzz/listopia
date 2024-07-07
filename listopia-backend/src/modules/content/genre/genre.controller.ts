import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { GenreService } from './genre.service';
import { CreateGenreDto } from '@modules/content/genre/dto/createGenre.dto';
import { ContentType } from '@prisma/client';
import { UpdateGenreDto } from '@modules/content/genre/dto/updateGenre.dto';
import { RolesGuard } from '@common/guards/RolesGuard/roles.guard';
import { Roles } from '@common/guards/RolesGuard/roles.decorator';

@Controller('genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Post('createGenre')
  async createGenre(@Body() createGenreDto: CreateGenreDto) {
    return this.genreService.createGenre(createGenreDto);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Post(':id/update')
  async updateGenre(
    @Param('id') id: number,
    @Body() updateGenreDto: UpdateGenreDto,
  ) {
    updateGenreDto.id = id;
    return this.genreService.updateGenre(updateGenreDto);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Post(':id/delete')
  async deleteGenre(@Param('id') id: number) {
    return this.genreService.deleteGenre(id);
  }

  @Get('')
  async getAllGenres() {
    return this.genreService.getAllGenres();
  }

  @Get(':genreType')
  async getGenresByType(@Param('genreType') genreType: ContentType) {
    return this.genreService.getGenresByType(genreType);
  }
}
