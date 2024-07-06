import { PersonCareer } from '@prisma/client';

export interface CreatePersonDto {
  name: string;
  description?: string;
  photo?: Express.Multer.File;
  birthday?: Date;
  career: PersonCareer[];
}
