import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/books.entity';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Book]), UsersModule],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
