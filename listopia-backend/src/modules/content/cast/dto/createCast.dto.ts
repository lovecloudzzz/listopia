import { ContentType, RoleType } from '@prisma/client';

// Интерфейс с обязательным полем contentId
export interface CreateCastDto {
  roleName?: string;
  roleActor?: string;
  rolePhoto?: Express.Multer.File;
  roleType?: RoleType;
  contentType: ContentType;
  contentId: number; // Обязательное поле
  characterId?: number;
  actorId?: number;
}

// Интерфейс без обязательного поля contentId
export interface CreateCastDtoWithoutId {
  roleName?: string;
  roleActor?: string;
  rolePhoto?: Express.Multer.File;
  roleType?: RoleType;
  contentType: ContentType;
  characterId?: number;
  actorId?: number;
}
