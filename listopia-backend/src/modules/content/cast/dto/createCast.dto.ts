import { ContentType, RoleType } from '@prisma/client';

export class CreateCastDto {
  roleName?: string;
  roleActor?: string;
  rolePhoto?: Express.Multer.File;
  roleType?: RoleType;
  contentType: ContentType;
  contentId: number;
  characterId?: number;
  actorId?: number;
}
