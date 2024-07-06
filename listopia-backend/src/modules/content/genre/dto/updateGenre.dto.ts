import { ContentType } from '@prisma/client';

export interface UpdateGenreDto {
  id: number;
  name?: string;
  description?: string;
  types?: ContentType[];
}
