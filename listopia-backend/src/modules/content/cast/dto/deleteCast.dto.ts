import { ContentType } from '@prisma/client';

export class DeleteCastDto {
  id: number;
  contentType: ContentType;
}
