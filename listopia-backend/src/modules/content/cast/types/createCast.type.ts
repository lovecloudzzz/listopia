import { ContentType, RoleType } from '@prisma/client';

export type CreateCastType = {
  roleName?: string;
  roleActor?: string;
  rolePhoto?: Express.Multer.File;
  roleType?: RoleType;
  contentType: ContentType;
  contentId: number;
  characterId?: number;
  actorId?: number;
};

export type CreateCastDtoWithoutId = Omit<CreateCastType, 'id'>;
