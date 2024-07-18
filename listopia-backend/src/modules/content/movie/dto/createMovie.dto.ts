import { CreateCastDtoWithoutId } from '@modules/content/cast/dto/createCast.dto';
import { AgeRating, MovieStatus, MovieType } from '@prisma/client';

export interface CreateMovieDto {
  title: string;
  description?: string;
  movieType?: MovieType;
  directors_ids?: number[];
  studios_ids?: number[];
  poster?: Express.Multer.File;
  release?: Date;
  ageRating?: AgeRating;
  status?: MovieStatus;
  duration?: number;
  isSeries?: boolean;
  seriesCount?: number;
  genres_ids?: number[];
  themes_ids?: number[];
  franchise_ids?: number[];
  cast?: CreateCastDtoWithoutId[];
}
