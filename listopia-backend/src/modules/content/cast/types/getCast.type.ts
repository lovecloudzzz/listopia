import { ContentType } from '@prisma/client';

export type GetCastType = {
  contentType: ContentType;
  contentId: number;
};
