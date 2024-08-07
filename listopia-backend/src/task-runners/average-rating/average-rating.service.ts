import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import {
  BookListItem,
  ContentType,
  GameListItem,
  MovieListItem,
} from '@prisma/client';
import { PrismaService } from '@prismaPath/prisma.service';

type ListItem = BookListItem | MovieListItem | GameListItem;
type ListItemModel = 'bookListItem' | 'movieListItem' | 'gameListItem';
type ItemModel = 'book' | 'movie' | 'game';

@Injectable()
export class AverageRatingService {
  constructor(private readonly prisma: PrismaService) {}

  @Cron('0 0 * * 6')
  async updateBooksRatings() {
    await this.updateRatingsForListItems(ContentType.BOOK);
  }

  @Cron('0 0 * * 5')
  async updateMovieRatings() {
    await this.updateRatingsForListItems(ContentType.MOVIE);
  }

  @Cron('0 0 * * 4')
  async updateGameRatings() {
    await this.updateRatingsForListItems(ContentType.GAME);
  }

  async runManualUpdate(contentType: ContentType) {
    if (contentType === ContentType.BOOK) {
      await this.updateBooksRatings();
    } else if (contentType === ContentType.MOVIE) {
      await this.updateMovieRatings();
    } else if (contentType === ContentType.GAME) {
      await this.updateGameRatings();
    }
  }

  private async updateRatingsForListItems(contentType: ContentType) {
    const listItemModel = this.getListItemModel(contentType);
    const itemModel = this.getItemModel(contentType);
    const itemIdField = this.getItemIdField(contentType);

    const listItems = await this.findListItems(listItemModel);

    const ratingMap = new Map<number, { totalRating: number; count: number }>();

    for (const item of listItems) {
      const id = item[itemIdField];
      const rating = item.rating || 0;

      if (!ratingMap.has(id)) {
        ratingMap.set(id, { totalRating: 0, count: 0 });
      }

      const entry = ratingMap.get(id);
      entry.totalRating += rating;
      entry.count += 1;
      ratingMap.set(id, entry);
    }

    for (const [id, { totalRating, count }] of ratingMap.entries()) {
      const averageRating = parseFloat((totalRating / count).toFixed(2));
      await this.updateItemModel(itemModel, id, averageRating);
    }
  }

  private async findListItems(model: ListItemModel): Promise<ListItem[]> {
    switch (model) {
      case 'bookListItem':
        return this.prisma.bookListItem.findMany({
          where: { rating: { not: null } },
        });
      case 'movieListItem':
        return this.prisma.movieListItem.findMany({
          where: { rating: { not: null } },
        });
      case 'gameListItem':
        return this.prisma.gameListItem.findMany({
          where: { rating: { not: null } },
        });
      default:
        throw new Error(`Unknown list item model: ${model}`);
    }
  }

  private async updateItemModel(model: ItemModel, id: number, rating: number) {
    switch (model) {
      case 'book':
        await this.prisma.book.update({
          where: { id },
          data: { rating },
        });
        break;
      case 'movie':
        await this.prisma.movie.update({
          where: { id },
          data: { rating },
        });
        break;
      case 'game':
        await this.prisma.game.update({
          where: { id },
          data: { rating },
        });
        break;
      default:
        throw new Error(`Unknown item model: ${model}`);
    }
  }

  private getListItemModel(contentType: ContentType): ListItemModel {
    switch (contentType) {
      case ContentType.BOOK:
        return 'bookListItem';
      case ContentType.MOVIE:
        return 'movieListItem';
      case ContentType.GAME:
        return 'gameListItem';
      default:
        throw new Error(`Unknown content type: ${contentType}`);
    }
  }

  private getItemModel(contentType: ContentType): ItemModel {
    switch (contentType) {
      case ContentType.BOOK:
        return 'book';
      case ContentType.MOVIE:
        return 'movie';
      case ContentType.GAME:
        return 'game';
      default:
        throw new Error(`Unknown content type: ${contentType}`);
    }
  }

  private getItemIdField(
    contentType: ContentType,
  ): 'bookId' | 'movieId' | 'gameId' {
    switch (contentType) {
      case ContentType.BOOK:
        return 'bookId';
      case ContentType.MOVIE:
        return 'movieId';
      case ContentType.GAME:
        return 'gameId';
      default:
        throw new Error(`Unknown content type: ${contentType}`);
    }
  }
}
