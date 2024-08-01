import type {
  baseListItemType,
  ListBookMaxPagesType,
  ListItemCurrentType,
  ListItemNoteType,
  ListItemRatingType,
  ListItemReviewType,
  ListItemType,
} from '@modules/content/list/types/listItem.type';
import { Injectable } from '@nestjs/common';
import { ContentType, ListItemStatus } from '@prisma/client';
import { PrismaService } from '@prismaPath/prisma.service';

@Injectable()
export class ListService {
  constructor(private readonly prisma: PrismaService) {}

  async UpdateNote(data: ListItemNoteType) {
    const { userId, contentType, contentId, note } = data;

    const where = this.getWhereClause(contentType, userId, contentId);
    const updateData = { note };

    return this.prisma[this.getModelName(contentType)].update({
      where,
      data: updateData,
    });
  }

  async UpdateRating(data: ListItemRatingType) {
    const { userId, contentType, contentId, rating } = data;

    const where = this.getWhereClause(contentType, userId, contentId);
    const updateData = { rating };

    return this.prisma[this.getModelName(contentType)].update({
      where,
      data: updateData,
    });
  }

  async UpdateReview(data: ListItemReviewType) {
    const { userId, contentType, contentId, review } = data;

    const where = this.getWhereClause(contentType, userId, contentId);
    const updateData = { review };

    return this.prisma[this.getModelName(contentType)].update({
      where,
      data: updateData,
    });
  }

  async UpdateCurrent(data: ListItemCurrentType) {
    const { userId, contentType, contentId, current } = data;

    const where = this.getWhereClause(contentType, userId, contentId);
    const updateData = { current };

    if (contentType === ContentType.BOOK) {
      const bookItem = await this.prisma[
        this.getModelName(contentType)
      ].findUnique({
        where,
      });
      if (bookItem && current === bookItem.maxPages) {
        updateData['status'] = ListItemStatus.WATCHED;
      }
    } else if (contentType === ContentType.MOVIE) {
      const movie = await this.prisma.movie.findUnique({
        where: { id: contentId },
      });
      if (movie && current === movie.seriesCount) {
        updateData['status'] = ListItemStatus.WATCHED;
      }
    }

    return await this.prisma[this.getModelName(contentType)].update({
      where,
      data: updateData,
    });
  }

  async UpdateMaxPages(data: ListBookMaxPagesType) {
    const { userId, contentType, contentId, maxPages } = data;

    if (contentType != ContentType.BOOK) {
      throw new Error('This method can be used only for Book');
    }

    if (maxPages < 1) {
      throw new Error('Max value should be greater than 1');
    }

    const where = { userId_bookId: { userId, bookId: contentId } };
    const updateData = { maxPages };

    return this.prisma.bookListItem.update({
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
      create: { userId, contentId, status },
      update: updateData,
    });
  }

  async deleteListItem(data: baseListItemType) {
    const { userId, contentType, contentId } = data;

    const where = this.getWhereClause(contentType, userId, contentId);

    return this.prisma[this.getModelName(contentType)].delete({
      where,
    });
  }

  async getAllListItemsByUser(userId: number) {
    const bookItems = await this.prisma.bookListItem.findMany({
      where: { userId },
    });
    const gameItems = await this.prisma.gameListItem.findMany({
      where: { userId },
    });
    const movieItems = await this.prisma.movieListItem.findMany({
      where: { userId },
    });
    return { bookItems, gameItems, movieItems };
  }

  async getListItemsByTypeAndStatus(data: Omit<ListItemType, 'contentId'>) {
    const { userId, contentType, status } = data;
    const where = { userId, status };
    return this.prisma[this.getModelName(contentType)].findMany({ where });
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
