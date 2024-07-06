import { PersonCareer } from '@prisma/client';

export interface UpdatePersonDto {
  id: number;
  name?: string;
  description?: string;
  photo?: Express.Multer.File;
  birthday?: Date;
  career?: PersonCareer[];
}
