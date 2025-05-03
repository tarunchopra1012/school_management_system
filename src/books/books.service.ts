import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from 'src/books/dto/create-book.dto';
import { UpdateBookDto } from 'src/books/dto//update-book.dto';
import { GetBookFilterDto } from 'src/books/dto/get-book-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/books.entity';
import PostgreSQLErrorCode from '../common/postgresql-error-codes';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  async findBooks(filterDto: GetBookFilterDto) {
    const { search, publication_date: publicationDate, language } = filterDto;
    const query = this.bookRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.user', 'user');

    if (search) {
      query.andWhere('(book.title iLIKE :search OR user.name iLIKE :search)', {
        search: `%${search}%`,
      });
    }

    if (publicationDate) {
      query.andWhere('book.publicationDate = :publicationDate', {
        publicationDate,
      });
    }

    if (language) {
      query.andWhere('book.language = :language', { language });
    }

    return query.getMany();
  }

  async createBook(createBookDto: CreateBookDto) {
    const book = this.bookRepository.create({
      ...createBookDto,
      user: {
        id: createBookDto.userId,
      },
    });

    try {
      return await this.bookRepository.save(book);
    } catch (error) {
      if (error.code === PostgreSQLErrorCode.ForeignKeyViolation) {
        throw new NotFoundException(
          `Author with id ${createBookDto.userId} doesn't exist`,
        );
      }
      throw error;
    }
  }

  async findBookById(bookId: number) {
    const book = await this.bookRepository.findOneBy({ id: bookId });
    if (!book) {
      throw new NotFoundException(`Book with id ${bookId} not found`);
    }
    return book;
  }

  async updateBook(bookId: number, updatedBook: UpdateBookDto) {
    try {
      const book = await this.bookRepository.preload({
        id: bookId,
        ...updatedBook,
        ...(updatedBook.userId ? { author: { id: updatedBook.userId } } : {}),
      });

      if (!book) {
        throw new NotFoundException(`Book with id ${bookId} not found`);
      }

      return await this.bookRepository.save(book);
    } catch (error) {
      if (error.code === PostgreSQLErrorCode.ForeignKeyViolation) {
        throw new NotFoundException(
          `Author with id ${updatedBook.userId} doesn't exist`,
        );
      }
      throw error;
    }
  }

  async deleteBook(bookId: number) {
    const book = await this.bookRepository.findOneBy({ id: bookId });
    if (!book) {
      throw new NotFoundException(`Book with id ${bookId} not found`);
    }
    return this.bookRepository.remove(book);
  }
}
