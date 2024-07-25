import { Roles } from '@common/decorators/roles.decorator';

import { RolesGuard } from '@common/guards/RolesGuard/roles.guard';
import type { CreateBookType } from '@modules/content/book/types/createBook.type';
import type { GetBooksType } from '@modules/content/book/types/getBooks.type';
import type { UpdateBookTypeWithoutId } from '@modules/content/book/types/updateBook.type';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Book } from '@prisma/client';
import { BookService } from './book.service';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get(':id')
  async getBook(@Param('id') id: number): Promise<Book> {
    return this.bookService.getBook(id);
  }

  @Get()
  async getBooks(@Query() getBooksData: GetBooksType): Promise<Book[]> {
    return this.bookService.getBooks(getBooksData);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Post()
  async createBook(@Body() createBookData: CreateBookType): Promise<Book> {
    return this.bookService.createBook(createBookData);
  }

  @Put(':id')
  async updateBook(
    @Param('id') id: number,
    @Body() updateBookData: UpdateBookTypeWithoutId,
  ): Promise<Book> {
    return this.bookService.updateBook({ ...updateBookData, id: id });
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Delete(':id')
  async deleteBook(@Param('id') id: number): Promise<Book> {
    return this.bookService.deleteBook(id);
  }
}
