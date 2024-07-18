import { UpdateCastDto } from '@modules/content/cast/dto/updateCast.dto';
import { AgeRating, MovieStatus, MovieType } from '@prisma/client';

export interface UpdateMovieDto {
  id: number;
  title?: string;
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
  cast?: UpdateCastDto[];
}
