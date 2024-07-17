import { UpdateCastDto } from '@modules/content/cast/dto/updateCast.dto';
import { AgeRating, BookStatus } from '@prisma/client';

export interface UpdateBookDto {
  id: number;
  title?: string;
  description?: string;
  authors_ids?: number[];
  poster?: Express.Multer.File;
  release?: Date;
  ageRating?: AgeRating;
  status?: BookStatus;
  pageCount?: number;
  genres_ids?: number[];
  themes_ids?: number[];
  franchise_ids?: number[];
  cast?: UpdateCastDto[];
}
