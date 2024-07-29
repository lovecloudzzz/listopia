import { FileUtil } from '@common/utils/file.util';
import { createUpdateData } from '@common/utils/updateData.util';
import type {
  CollectionItem,
  CollectionType,
  CollectionUpdateType,
  CollectionWithItemsType,
} from '@modules/content/collection/types/collection.type';
import { Injectable } from '@nestjs/common';
import {
  Collection,
  CollectionBook,
  CollectionGame,
  CollectionMovie,
  ContentType,
} from '@prisma/client';
import { PrismaService } from '@prismaPath/prisma.service';

@Injectable()
export class CollectionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileUtil: FileUtil,
  ) {}

  async getCollection(id: number): Promise<CollectionWithItemsType> {
    const collection = await this.prisma.collection.findUnique({
      where: { id },
      include: {
        books: {
          include: { book: true },
        },
        movies: {
          include: { movie: true },
        },
        games: {
          include: { game: true },
        },
      },
    });

    this.validate(collection);

    return {
      ...collection,
      books: collection.books.map((cb) => cb.book),
      movies: collection.movies.map((cm) => cm.movie),
      games: collection.games.map((cg) => cg.game),
    };
  }

  async createCollection(data: CollectionType): Promise<Collection> {
    const { userId, name, description, poster } = data;

    let posterPath = '';
    if (poster) {
      posterPath = await this.fileUtil.saveFile({
        file: poster,
        filename: `${name}_${Date.now()}`,
        folder: 'collections_posters',
      });
    }

    return this.prisma.collection.create({
      data: {
        userId,
        name,
        description,
        posterPath,
      },
    });
  }

  async updateCollection(
    updateData: CollectionUpdateType,
  ): Promise<Collection> {
    const { collectionId, userId, poster, name, description } = updateData;

    const collection = await this.prisma.collection.findUnique({
      where: { id: collectionId },
    });

    this.validate(collection, userId);

    let posterPath = '';
    if (poster) {
      posterPath = await this.fileUtil.updateFile(
        poster,
        collection?.posterPath,
        `${name}_${Date.now()}`,
        'collections_posters',
      );
    }

    const data = createUpdateData({ posterPath, name, description });

    return this.prisma.collection.update({
      where: { id: collectionId },
      data,
    });
  }

  async getCollectionsByUserId(userId: number): Promise<Collection[]> {
    return this.prisma.collection.findMany({
      where: { userId },
    });
  }

  async deleteCollection(
    data: Omit<CollectionItem, 'contentType' | 'contentId'>,
  ): Promise<Collection> {
    const { collectionId, userId } = data;

    const collection = await this.prisma.collection.findUnique({
      where: { id: collectionId },
    });

    this.validate(collection, userId);

    return this.prisma.collection.delete({ where: { id: collectionId } });
  }

  async addItemToCollection(
    addItemToCollectionData: CollectionItem,
  ): Promise<CollectionBook | CollectionGame | CollectionMovie> {
    const { userId, collectionId, contentType, contentId } =
      addItemToCollectionData;

    const collection = await this.prisma.collection.findUnique({
      where: { id: collectionId },
    });

    this.validate(collection, userId);

    const modelName = this.getModelName(contentType);
    const data = this.createCollectionItemData(
      contentType,
      collectionId,
      contentId,
    );

    return this.prisma[modelName].create({ data });
  }

  async deleteItemFromCollection(
    data: CollectionItem,
  ): Promise<CollectionBook | CollectionGame | CollectionMovie> {
    const { collectionId, userId, contentType, contentId } = data;

    const collection = await this.prisma.collection.findUnique({
      where: { id: collectionId },
    });

    this.validate(collection, userId);

    const modelName = this.getModelName(contentType);
    const where = this.createCollectionItemData(
      contentType,
      collectionId,
      contentId,
    );

    return this.prisma[modelName].delete({ where });
  }

  private getModelName(contentType: ContentType): string {
    switch (contentType) {
      case 'BOOK':
        return 'collectionBook';
      case 'GAME':
        return 'collectionGame';
      case 'MOVIE':
        return 'collectionMovie';
      default:
        throw new Error(`Unknown content type: ${contentType}`);
    }
  }

  private createCollectionItemData(
    contentType: ContentType,
    collectionId: number,
    contentId: number,
  ): any {
    const contentIdField = `${contentType.toLowerCase()}Id`;
    return {
      collectionId,
      [contentIdField]: contentId,
    };
  }

  private validate(collection: Collection, userId?: number) {
    if (!collection) {
      throw new Error('Collection not found');
    }

    if (collection.userId !== userId) {
      throw new Error('User is not the owner of the collection');
    }
  }
}
