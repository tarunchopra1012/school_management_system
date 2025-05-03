import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { GetBookFilterDto } from './dto/get-book-filter.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly bookService: BooksService) {}

  @Get()
  findAll(@Query() filterDto: GetBookFilterDto) {
    return this.bookService.findBooks(filterDto);
  }

  @Post()
  create(@Body() body: CreateBookDto) {
    return this.bookService.createBook(body);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookService.findBookById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() body: UpdateBookDto) {
    const book = this.bookService.updateBook(+id, body);
    return book;
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.bookService.deleteBook(+id);
  }
}
