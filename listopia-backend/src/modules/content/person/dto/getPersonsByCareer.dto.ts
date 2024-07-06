import { PersonCareer } from '@prisma/client';

export interface GetPersonsByCareerDto {
  career: PersonCareer;
  page: number;
  pageSize: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}
