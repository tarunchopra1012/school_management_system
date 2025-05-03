import { IsDateString, IsEnum, IsString, IsOptional } from 'class-validator';
import { Language } from '../../books/entities/books.entity';

export class GetBookFilterDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  user?: string;

  @IsDateString()
  @IsOptional()
  publication_date?: string;

  @IsEnum(Language)
  @IsOptional()
  language?: Language;
}
