import { CreateCastDataWithoutId } from '@modules/content/cast/types/createCast.type';
import { AgeRating, BookStatus } from '@prisma/client';

export type CreateBookType = {
  title: string;
  description?: string;
  authors_ids?: number[];
  poster?: Express.Multer.File;
  release?: Date;
  ageRating?: AgeRating;
  status?: BookStatus;
  readingHoursCount?: number;
  genres_ids?: number[];
  themes_ids?: number[];
  franchise_ids?: number[];
  cast?: CreateCastDataWithoutId[];
  links?: Record<string, string>;
};
