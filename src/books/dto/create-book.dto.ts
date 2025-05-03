import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { Language } from '../../books/entities/books.entity';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsInt()
  userId: number;

  @IsDateString()
  @IsNotEmpty()
  publicationDate: string;

  @IsNumber()
  @IsNotEmpty()
  numberOfPages: number;

  @IsEnum(Language)
  @IsNotEmpty()
  language: Language;
}
