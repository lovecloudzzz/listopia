import { CreateCastDtoWithoutId } from '@modules/content/cast/dto/createCast.dto';
import { AgeRating, GameStatus } from '@prisma/client';

export interface CreateGameDto {
  title: string;
  description?: string;
  developers_ids: number[];
  publishers_ids: number[];
  platforms_ids: number[];
  poster?: Express.Multer.File;
  release?: Date;
  ageRating?: AgeRating;
  status?: GameStatus;
  duration?: number;
  genres_ids?: number[];
  themes_ids?: number[];
  franchise_ids?: number[];
  cast?: CreateCastDtoWithoutId[];
}
