import { Module } from '@nestjs/common';
import { ClassesController } from './classes.controller';
import { ClassesService } from './classes.service';
import { StudentsModule } from 'src/students/students.module';

@Module({
  controllers: [ClassesController],
  imports: [StudentsModule],
  providers: [ClassesService],
})
export class ClassesModule {}