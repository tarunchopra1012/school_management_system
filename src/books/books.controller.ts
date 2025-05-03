import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { GetBookFilterDto } from './dto/get-book-filter.dto';
import { LanguageValidationPipe } from '../common/pipes/language-validation/language-validation.pipe';

// @UsePipes(new ValidationPipe())
@Controller('books')
export class BooksController {
  constructor(private readonly bookService: BooksService) {}

  @Get()
  findAll(@Query() filterDto: GetBookFilterDto) {
    return this.bookService.findBooks(filterDto);
  }

  @Post()
  // @UsePipes(new ValidationPipe())
  @UsePipes(LanguageValidationPipe)
  create(@Body() body: CreateBookDto) {
    return this.bookService.createBook(body);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookService.findBookById(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateBookDto) {
    const book = this.bookService.updateBook(id, body);
    return book;
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: string) {
    return this.bookService.deleteBook(+id);
  }
}
