import { UpdateCastType } from '@modules/content/cast/types/updateCast.type';
import { AgeRating, MovieStatus, MovieType } from '@prisma/client';

export type UpdateMovieType = {
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
  cast?: UpdateCastType[];
  links?: Record<string, string>;
};

export type UpdateMovieTypeWithoutId = Omit<UpdateMovieType, 'id'>;
