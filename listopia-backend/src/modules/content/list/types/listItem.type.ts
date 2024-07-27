import {
  BookStatus,
  ContentType,
  GameStatus,
  MovieStatus,
} from '@prisma/client';

export type baseListItemType = {
  userId: number;
  contentType: ContentType;
  contentId: number;
};

export type ListItemNoteType = baseListItemType & {
  note: string | null;
};

export type ListItemRatingType = baseListItemType & {
  rating: number | null;
};

export type ListItemReviewType = baseListItemType & {
  review: string | null;
};

export type ListItemCurrentType = baseListItemType & {
  current: number | null;
};

export type ListItemType = baseListItemType & {
  status: BookStatus | MovieStatus | GameStatus;
};
