import { Roles } from '@common/guards/RolesGuard/roles.decorator';
import { RolesGuard } from '@common/guards/RolesGuard/roles.guard';
import { CreateMovieDto } from '@modules/content/movie/dto/createMovie.dto';
import { GetMoviesDto } from '@modules/content/movie/dto/getMovies.dto';
import { UpdateMovieDto } from '@modules/content/movie/dto/updateMovie.dto';
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
  async getMovie(@Param('id') id: number): Promise<Movie> {
    return this.movieService.getMovie(id);
  }

  @Get()
  async getMovies(@Query() getMoviesDto: GetMoviesDto): Promise<Movie[]> {
    return this.movieService.getMovies(getMoviesDto);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Post()
  async createMovie(@Body() createMovieDto: CreateMovieDto): Promise<Movie> {
    return this.movieService.createMovie(createMovieDto);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Put()
  async updateMovie(@Body() updatePersonDto: UpdateMovieDto): Promise<Movie> {
    return this.movieService.updateMovie(updatePersonDto);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Delete(':id')
  async deleteMovie(@Param('id') id: number): Promise<Movie> {
    return this.movieService.deleteMovie(id);
  }
}
