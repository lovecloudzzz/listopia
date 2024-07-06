import { ContentType } from '@prisma/client';

export interface CreateGenreDto {
  name: string;
  description?: string;
  types: ContentType[];
}
