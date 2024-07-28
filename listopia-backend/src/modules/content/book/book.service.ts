import { FileUtil } from '@common/utils/file.util';
import { createUpdateData } from '@common/utils/updateData.util';
import type { CreateBookType } from '@modules/content/book/types/createBook.type';
import type { GetBooksType } from '@modules/content/book/types/getBooks.type';
import type { UpdateBookType } from '@modules/content/book/types/updateBook.type';
import { CastService } from '@modules/content/cast/cast.service';
import { FranchiseService } from '@modules/content/franchise/franchise.service';
import { Injectable } from '@nestjs/common';
import { Book, Prisma } from '@prisma/client';
import { PrismaService } from '@prismaPath/prisma.service';

@Injectable()
export class BookService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileUtil: FileUtil,
    private readonly castService: CastService,
    private readonly franchiseService: FranchiseService,
  ) {}

  async getBook(id: number): Promise<Book> {
    const existingBook = await this.prisma.book.findUnique({
      where: { id: id },
    });

    if (!existingBook) {
      throw new Error('Book not found');
    }

    return existingBook;
  }

  async getBooks(getBooksData: GetBooksType): Promise<Book[]> {
    const { page, pageSize, sortField, sortOrder, genreIds, themeIds } =
      getBooksData;

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    let orderBy: Prisma.BookOrderByWithRelationInput = {
      visitCount: 'desc',
    };

    if (sortField && sortOrder) {
      orderBy = { [sortField]: sortOrder };
    }

    return this.prisma.book.findMany({
      skip,
      take,
      orderBy,
      where: {
        AND: [
          genreIds ? { genres: { some: { id: { in: genreIds } } } } : undefined,
          themeIds ? { themes: { some: { id: { in: themeIds } } } } : undefined,
        ],
      },
    });
  }

  async createBook(createBookData: CreateBookType): Promise<Book> {
    const {
      title,
      description,
      poster,
      authors_ids,
      themes_ids,
      release,
      genres_ids,
      franchise_ids,
      cast,
      status,
      readingHoursCount,
      ageRating,
      links,
    } = createBookData;

    let posterPath = '';
    if (poster) {
      posterPath = await this.fileUtil.saveFile({
        file: poster,
        filename: `${title}_${Date.now()}`,
        folder: 'book_posters',
      });
    }

    const book = await this.prisma.book.create({
      data: {
        title: title,
        description: description,
        posterPath: posterPath,
        release: release,
        status: status,
        readingHoursCount: readingHoursCount,
        ageRating: ageRating,
        links: links,
        authors: {
          connect: authors_ids.map((id) => ({ id })),
        },
        themes: {
          connect: themes_ids.map((id) => ({ id })),
        },
        genres: {
          connect: genres_ids.map((id) => ({ id })),
        },
      },
    });

    await this.franchiseService.addToFranchises({
      franchiseIds: franchise_ids,
      contentId: book.id,
      contentType: 'BOOK',
    });

    if (cast && cast.length > 0) {
      const updatedCast = cast.map((c) => ({ ...c, contentId: book.id }));
      await this.castService.createCastByArray(updatedCast);
    }

    return book;
  }

  async updateBook(updateBookData: UpdateBookType): Promise<Book> {
    const {
      id,
      title,
      description,
      poster,
      authors_ids,
      themes_ids,
      release,
      genres_ids,
      franchise_ids,
      cast,
      status,
      readingHoursCount,
      ageRating,
      links,
    } = updateBookData;

    const existingBook = await this.prisma.book.findUnique({ where: { id } });
    if (!existingBook) {
      throw new Error('Book not found');
    }

    let posterPath = existingBook.posterPath;
    if (poster) {
      posterPath = await this.fileUtil.updateFile(
        poster,
        existingBook.posterPath,
        `${title}_${Date.now()}`,
        'book_posters',
      );
    }

    const updateData = createUpdateData({
      title,
      description,
      release,
      status,
      readingHoursCount,
      ageRating,
      links,
      posterPath,
      authors: authors_ids,
      themes: themes_ids,
      genres: genres_ids,
      BookFranchise: franchise_ids,
    });

    const book = await this.prisma.book.update({
      where: { id },
      data: updateData,
    });

    if (cast && cast.length > 0) {
      await this.castService.updateCasts(cast);
    }

    return book;
  }

  async deleteBook(id: number): Promise<Book> {
    return this.prisma.book.delete({ where: { id } });
  }
}
