import type {
  baseListItemType,
  ListItemNoteType,
  ListItemRatingType,
  ListItemReviewType,
  ListItemType,
} from '@modules/content/list/types/listItem.type';
import { Injectable } from '@nestjs/common';
import { ContentType } from '@prisma/client';
import { PrismaService } from '@prismaPath/prisma.service';

@Injectable()
export class ListService {
  constructor(private readonly prisma: PrismaService) {}

  async addOrUpdateNote(data: ListItemNoteType) {
    const { userId, contentType, contentId, note } = data;

    const where = this.getWhereClause(contentType, userId, contentId);
    const updateData = { note };

    return this.prisma[this.getModelName(contentType)].update({
      where,
      data: updateData,
    });
  }

  async addOrUpdateRating(data: ListItemRatingType) {
    const { userId, contentType, contentId, rating } = data;

    const where = this.getWhereClause(contentType, userId, contentId);
    const updateData = { rating };

    return this.prisma[this.getModelName(contentType)].update({
      where,
      data: updateData,
    });
  }

  async addOrUpdateReview(data: ListItemReviewType) {
    const { userId, contentType, contentId, review } = data;

    const where = this.getWhereClause(contentType, userId, contentId);
    const updateData = { review };

    return this.prisma[this.getModelName(contentType)].update({
      where,
      data: updateData,
    });
  }

  async addOrUpdateListItem(data: ListItemType) {
    const { userId, contentType, contentId, status } = data;

    const where = this.getWhereClause(contentType, userId, contentId);
    const updateData = { status };

    return this.prisma[this.getModelName(contentType)].upsert({
      where,
      data: updateData,
    });
  }

  async deleteListItem(data: baseListItemType) {
    const { userId, contentType, contentId } = data;

    const where = this.getWhereClause(contentType, userId, contentId);

    return this.prisma[this.getModelName(contentType)].delete({
      where,
    });
  }

  private getModelName(contentType: ContentType): string {
    switch (contentType) {
      case 'BOOK':
        return 'bookListItem';
      case 'GAME':
        return 'gameListItem';
      case 'MOVIE':
        return 'movieListItem';
      default:
        throw new Error(`Unknown content type: ${contentType}`);
    }
  }

  private getWhereClause(
    contentType: ContentType,
    userId: number,
    contentId: number,
  ) {
    switch (contentType) {
      case 'BOOK':
        return { userId_bookId: { userId, bookId: contentId } };
      case 'GAME':
        return { userId_gameId: { userId, gameId: contentId } };
      case 'MOVIE':
        return { userId_movieId: { userId, movieId: contentId } };
      default:
        throw new Error(`Unknown content type: ${contentType}`);
    }
  }
}
