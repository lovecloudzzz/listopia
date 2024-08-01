import { FileUtil } from '@common/utils/file.util';
import { createUpdateData } from '@common/utils/updateData.util';
import { CastService } from '@modules/content/cast/cast.service';
import { FranchiseService } from '@modules/content/franchise/franchise.service';
import type { CreateMovieType } from '@modules/content/movie/types/createMovie.type';
import type { GetMoviesType } from '@modules/content/movie/types/getMovies.type';
import type { UpdateMovieType } from '@modules/content/movie/types/updateMovie.type';
import { Injectable } from '@nestjs/common';
import { Movie, MovieListItem, Prisma } from '@prisma/client';
import { PrismaService } from '@prismaPath/prisma.service';

@Injectable()
export class MovieService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileUtil: FileUtil,
    private readonly castService: CastService,
    private readonly franchiseService: FranchiseService,
  ) {}

  async getMovie(
    id: number,
    userId?: number,
  ): Promise<Movie & { movieListItem?: MovieListItem }> {
    const existingMovie = await this.prisma.movie.findUnique({
      where: { id: id },
    });

    if (!existingMovie) {
      throw new Error('Movie not found');
    }

    if (userId) {
      const movieListItem = await this.prisma.movieListItem.findUnique({
        where: { userId_movieId: { userId, movieId: id } },
      });
      return { ...existingMovie, movieListItem };
    }

    return existingMovie;
  }

  async getMovies(getMoviesData: GetMoviesType): Promise<Movie[]> {
    const { page, pageSize, sortField, sortOrder, genreIds, themeIds } =
      getMoviesData;

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
      where: {
        AND: [
          genreIds ? { genres: { some: { id: { in: genreIds } } } } : undefined,
          themeIds ? { themes: { some: { id: { in: themeIds } } } } : undefined,
        ],
      },
    });
  }

  async createMovie(createMovieData: CreateMovieType): Promise<Movie> {
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
      links,
    } = createMovieData;

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
        links: links,
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
      },
    });

    await this.franchiseService.addToFranchises({
      franchiseIds: franchise_ids,
      contentId: movie.id,
      contentType: 'MOVIE',
    });

    if (cast && cast.length > 0) {
      const updatedCast = cast.map((c) => ({ ...c, contentId: movie.id }));
      await this.castService.createCastByArray(updatedCast);
    }

    return movie;
  }

  async updateMovie(updateMovieData: UpdateMovieType): Promise<Movie> {
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
      links,
    } = updateMovieData;

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

    const updateData = createUpdateData({
      title,
      description,
      movieType,
      release,
      status,
      duration,
      ageRating,
      isSeries,
      seriesCount,
      links,
      posterPath,
      directors: directors_ids,
      studios: studios_ids,
      themes: themes_ids,
      genres: genres_ids,
      MovieFranchise: franchise_ids,
    });

    const movie = await this.prisma.movie.update({
      where: { id },
      data: updateData,
    });

    if (cast && cast.length > 0) {
      await this.castService.updateCasts(cast);
    }

    return movie;
  }

  async deleteMovie(id: number): Promise<Movie> {
    return this.prisma.movie.delete({ where: { id } });
  }
}
