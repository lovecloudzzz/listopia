import { ContentType } from '@prisma/client';

export type UpdateGenreType = {
  id: number;
  name?: string;
  description?: string;
  types?: ContentType[];
};

export type UpdateGenreTypeWithoutId = Omit<UpdateGenreType, 'id'>;
