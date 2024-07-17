import { FileUtil } from '@common/utils/file.util';
import { CreateBookDto } from '@modules/content/book/dto/createBook.dto';
import { GetBooksDto } from '@modules/content/book/dto/getBooks.dto';
import { UpdateBookDto } from '@modules/content/book/dto/updateBook.dto';
import { CastService } from '@modules/content/cast/cast.service';
import { Injectable } from '@nestjs/common';
import { Book, Prisma } from '@prisma/client';
import { PrismaService } from '@prismaPath/prisma.service';

@Injectable()
export class BookService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileUtil: FileUtil,
    private readonly castService: CastService,
  ) {}

  async getBook(id: number): Promise<Book> {
    const existingBook = this.prisma.book.findUnique({ where: { id: id } });

    if (!existingBook) {
      throw new Error('Book not found');
    }

    return existingBook;
  }

  async getBooks(getBooksDto: GetBooksDto): Promise<Book[]> {
    const { page, pageSize, sortField, sortOrder } = getBooksDto;

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
    });
  }

  async createBook(createBookDto: CreateBookDto): Promise<Book> {
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
      pageCount,
      ageRating,
    } = createBookDto;

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
        title,
        description,
        posterPath,
        release,
        status,
        pageCount,
        ageRating,
        authors: {
          connect: authors_ids.map((id) => ({ id })),
        },
        themes: {
          connect: themes_ids.map((id) => ({ id })),
        },
        genres: {
          connect: genres_ids.map((id) => ({ id })),
        },
        BookFranchise: {
          connect: franchise_ids.map((id) => ({ id })),
        },
      },
    });

    if (cast && cast.length > 0) {
      const updatedCast = cast.map((c) => ({ ...c, contentId: book.id }));
      await this.castService.createCastByArray(updatedCast);
    }

    return book;
  }

  async updateBook(updateBookDto: UpdateBookDto): Promise<Book> {
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
      pageCount,
      ageRating,
    } = updateBookDto;

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

    const updateData: any = {
      title,
      description,
      release,
      status,
      pageCount,
      ageRating,
    };

    if (posterPath) {
      updateData.posterPath = posterPath;
    }

    if (authors_ids) {
      updateData.authors = {
        set: authors_ids.map((id) => ({ id })),
      };
    }

    if (themes_ids) {
      updateData.themes = {
        set: themes_ids.map((id) => ({ id })),
      };
    }

    if (genres_ids) {
      updateData.genres = {
        set: genres_ids.map((id) => ({ id })),
      };
    }

    if (franchise_ids) {
      updateData.BookFranchise = {
        set: franchise_ids.map((id) => ({ id })),
      };
    }

    const book = await this.prisma.book.update({
      where: { id },
      data: updateData,
    });

    if (cast && cast.length > 0) {
      await this.castService.updateCastByArray(cast);
    }

    return book;
  }

  async deleteBook(id: number): Promise<Book> {
    return this.prisma.book.delete({ where: { id } });
  }
}
