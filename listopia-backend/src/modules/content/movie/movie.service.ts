import { FileUtil } from '@common/utils/file.util';
import { CastService } from '@modules/content/cast/cast.service';
import { CreateMovieDto } from '@modules/content/movie/dto/createMovie.dto';
import { GetMoviesDto } from '@modules/content/movie/dto/getMovies.dto';
import { UpdateMovieDto } from '@modules/content/movie/dto/updateMovie.dto';
import { Injectable } from '@nestjs/common';
import { Movie, Prisma } from '@prisma/client';
import { PrismaService } from '@prismaPath/prisma.service';

@Injectable()
export class MovieService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileUtil: FileUtil,
    private readonly castService: CastService,
  ) {}

  async getMovie(id: number): Promise<Movie> {
    const existingMovie = this.prisma.movie.findUnique({ where: { id: id } });

    if (!existingMovie) {
      throw new Error('Movie not found');
    }

    return existingMovie;
  }

  async getMovies(getMoviesDto: GetMoviesDto): Promise<Movie[]> {
    const { page, pageSize, sortField, sortOrder } = getMoviesDto;

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    let orderBy: Prisma.MovieOrderByWithRelationInput = {
      visitCount: 'desc',
    };

    if (sortField && sortOrder) {
      orderBy = { [sortField]: sortOrder };
    }

    return this.prisma.movie.findMany({
      skip,
      take,
      orderBy,
    });
  }

  async createMovie(createMovieDto: CreateMovieDto): Promise<Movie> {
    const {
      title,
      description,
      movieType,
      poster,
      directors_ids,
      studios_ids,
      themes_ids,
      release,
      genres_ids,
      franchise_ids,
      cast,
      status,
      isSeries,
      seriesCount,
      duration,
      ageRating,
    } = createMovieDto;

    let posterPath = '';
    if (poster) {
      posterPath = await this.fileUtil.saveFile({
        file: poster,
        filename: `${title}_${Date.now()}`,
        folder: 'movie_posters',
      });
    }

    const movie = await this.prisma.movie.create({
      data: {
        title: title,
        description: description,
        MovieType: movieType,
        posterPath: posterPath,
        release: release,
        status: status,
        duration: duration,
        ageRating: ageRating,
        isSeries: isSeries,
        seriesCount: seriesCount,
        directors: {
          connect: directors_ids.map((id) => ({ id })),
        },
        studios: {
          connect: studios_ids.map((id) => ({ id })),
        },
        themes: {
          connect: themes_ids.map((id) => ({ id })),
        },
        genres: {
          connect: genres_ids.map((id) => ({ id })),
        },
        MovieFranchise: {
          connect: franchise_ids.map((id) => ({ id })),
        },
      },
    });

    if (cast && cast.length > 0) {
      const updatedCast = cast.map((c) => ({ ...c, contentId: movie.id }));
      await this.castService.createCastByArray(updatedCast);
    }

    return movie;
  }

  async updateMovie(updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const {
      id,
      title,
      description,
      movieType,
      poster,
      directors_ids,
      studios_ids,
      themes_ids,
      release,
      genres_ids,
      franchise_ids,
      cast,
      status,
      isSeries,
      seriesCount,
      duration,
      ageRating,
    } = updateMovieDto;

    const existingMovie = await this.prisma.movie.findUnique({ where: { id } });
    if (!existingMovie) {
      throw new Error('Movie not found');
    }

    let posterPath = existingMovie.posterPath;
    if (poster) {
      posterPath = await this.fileUtil.updateFile(
        poster,
        existingMovie.posterPath,
        `${title}_${Date.now()}`,
        'movie_posters',
      );
    }

    const updateData: any = {
      title: title,
      description: description,
      MovieType: movieType,
      release: release,
      status: status,
      duration: duration,
      ageRating: ageRating,
      isSeries: isSeries,
      seriesCount: seriesCount,
    };

    if (posterPath) {
      updateData.posterPath = posterPath;
    }

    if (directors_ids) {
      updateData.directors = {
        set: directors_ids.map((id) => ({ id })),
      };
    }
    if (studios_ids) {
      updateData.studios = {
        set: studios_ids.map((id) => ({ id })),
      };
    }
    if (themes_ids) {
      updateData.themes = {
        set: themes_ids.map((id) => ({ id })),
      };
    }

    if (genres_ids) {
      updateData.genres = {
        set: genres_ids.map((id) => ({ id })),
      };
    }

    if (franchise_ids) {
      updateData.MovieFranchise = {
        set: franchise_ids.map((id) => ({ id })),
      };
    }

    const movie = await this.prisma.movie.update({
      where: { id },
      data: updateData,
    });

    if (cast && cast.length > 0) {
      await this.castService.updateCastByArray(cast);
    }

    return movie;
  }

  async deleteMovie(id: number): Promise<Movie> {
    return this.prisma.movie.delete({ where: { id } });
  }
}
