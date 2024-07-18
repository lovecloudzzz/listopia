import { UpdateCastType } from '@modules/content/cast/types/updateCast.type';
import { AgeRating, GameStatus } from '@prisma/client';

export type UpdateGameType = {
  id: number;
  title?: string;
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
  cast?: UpdateCastType[];
};

export type UpdateGameTypeWithoutId = Omit<UpdateGameType, 'id'>;
