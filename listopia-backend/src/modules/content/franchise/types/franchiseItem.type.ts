import { ContentType } from '@prisma/client';

export type FranchiseItemType = {
  franchiseId: number;
  contentType: ContentType;
  contentId: number;
};

export type AddToFranchisesType = Omit<FranchiseItemType, 'franchiseId'> & {
  franchiseIds: number[];
};
