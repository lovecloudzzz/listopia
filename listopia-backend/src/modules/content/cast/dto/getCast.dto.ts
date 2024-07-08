import { ContentType } from '@prisma/client';

export class GetCastDto {
  contentType: ContentType;
  contentId: number;
}
