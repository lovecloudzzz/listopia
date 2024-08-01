import { CurrentUser } from '@common/decorators/current-user.decorator';
import { Roles } from '@common/decorators/roles.decorator';

import { RolesGuard } from '@common/guards/RolesGuard/roles.guard';
import type { UserPayload } from '@modules/auth/types/user-payload.type';
import type { CreateMovieType } from '@modules/content/movie/types/createMovie.type';
import type { GetMoviesType } from '@modules/content/movie/types/getMovies.type';
import type { UpdateMovieTypeWithoutId } from '@modules/content/movie/types/updateMovie.type';
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
import { Movie } from '@prisma/client';
import { MovieService } from './movie.service';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get(':id')
  async getMovie(
    @Param('id') id: number,
    @CurrentUser() user: UserPayload,
  ): Promise<Movie> {
    return this.movieService.getMovie(id, user?.id);
  }

  @Get()
  async getMovies(@Query() getMoviesData: GetMoviesType): Promise<Movie[]> {
    return this.movieService.getMovies(getMoviesData);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Post()
  async createMovie(@Body() createMovieData: CreateMovieType): Promise<Movie> {
    return this.movieService.createMovie(createMovieData);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Put('id')
  async updateMovie(
    @Body() updatePersonData: UpdateMovieTypeWithoutId,
    @Param('id') id: number,
  ): Promise<Movie> {
    return this.movieService.updateMovie({ ...updatePersonData, id: id });
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Delete(':id')
  async deleteMovie(@Param('id') id: number): Promise<Movie> {
    return this.movieService.deleteMovie(id);
  }
}
