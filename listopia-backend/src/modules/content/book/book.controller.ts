import { Roles } from '@common/guards/RolesGuard/roles.decorator';
import { RolesGuard } from '@common/guards/RolesGuard/roles.guard';
import { CreateBookDto } from '@modules/content/book/dto/createBook.dto';
import { GetBooksDto } from '@modules/content/book/dto/getBooks.dto';
import { UpdateBookDto } from '@modules/content/book/dto/updateBook.dto';
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
  async getBooks(@Query() getBooksDto: GetBooksDto): Promise<Book[]> {
    return this.bookService.getBooks(getBooksDto);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Post()
  async createBook(@Body() createBookDto: CreateBookDto): Promise<Book> {
    return this.bookService.createBook(createBookDto);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Put()
  async updateBook(@Body() updatePersonDto: UpdateBookDto): Promise<Book> {
    return this.bookService.updateBook(updatePersonDto);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Delete(':id')
  async deleteBook(@Param('id') id: number): Promise<Book> {
    return this.bookService.deleteBook(id);
  }
}
