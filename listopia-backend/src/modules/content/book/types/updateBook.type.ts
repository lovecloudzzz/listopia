import { UpdateCastType } from '@modules/content/cast/types/updateCast.type';
import { AgeRating, BookStatus } from '@prisma/client';

export type UpdateBookType = {
  id: number;
  title?: string;
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
  cast?: UpdateCastType[];
  links?: Record<string, string>;
};

export type UpdateBookTypeWithoutId = Omit<UpdateBookType, 'id'>;
