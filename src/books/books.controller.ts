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
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { GetBookFilterDto } from './dto/get-book-filter.dto';
import { LanguageValidationPipe } from '../common/pipes/language-validation/language-validation.pipe';
import { AuthGuard } from '../users/guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { userInfo } from 'os';

// @UsePipes(new ValidationPipe())
@UseGuards(AuthGuard)
@Controller('books')
export class BooksController {
  constructor(private readonly bookService: BooksService) {}

  @Get()
  findAll(
    @Query() filterDto: GetBookFilterDto,
    @CurrentUser('email') userInfo,
  ) {
    console.log(userInfo);
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
