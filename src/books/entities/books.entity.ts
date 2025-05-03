import { User } from '../../users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

export enum Language {
  ENGLISH = 'en',
  FRENCH = 'fr',
}

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToOne(() => User, (user) => user.books)
  user: User;

  @Column({ type: 'date' })
  publicationDate: Date;

  @Column()
  numberOfPages: number;

  @Column({ type: 'enum', enum: Language })
  language: Language;
}
