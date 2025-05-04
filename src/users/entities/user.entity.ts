import { Exclude } from 'class-transformer';
import { Book } from '../../books/entities/books.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

export enum Role {
  Admin = 'admin',
  Viewer = 'viewer',
  Author = 'author',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ enum: Role, default: Role.Viewer })
  role: string;

  @OneToMany(() => Book, (book) => book.user)
  books: Book[];
}
