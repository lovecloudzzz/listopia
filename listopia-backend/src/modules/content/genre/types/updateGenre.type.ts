import { ContentType } from '@prisma/client';

export type UpdateGenreType = {
  id: number;
  name?: string;
  description?: string;
  genreTypes?: ContentType[];
};

export type UpdateGenreTypeWithoutId = Omit<UpdateGenreType, 'id'>;
