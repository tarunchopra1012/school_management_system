import { Module } from '@nestjs/common';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { StudentsTwoController } from './students.two.controller';

@Module({
  controllers: [StudentsController, StudentsTwoController],
  providers: [StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}
