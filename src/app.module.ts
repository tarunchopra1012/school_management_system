import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentsModule } from './students/students.module';
import { ClassesModule } from './classes/classes.module';
import { EmailModule } from './email/email.module';

import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './books/entities/books.entity';
import { User } from './users/entities/user.entity';
import { DbConfigService } from './common/config-db.service';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forRootAsync({
      imports: [CommonModule],
      inject: [DbConfigService],
      useFactory: (configService: DbConfigService) => {
        const dbConfig = configService.getDatabaseConfig();
        return {
          type: 'postgres',
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.username,
          password: dbConfig.password,
          database: dbConfig.database,
          entities: [Book, User],
          synchronize: true,
        };
      },
    }),
    StudentsModule,
    ClassesModule,
    EmailModule,
    UsersModule,
    BooksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
