import { Controller, Get, Post, Body } from '@nestjs/common';
import { StudentsService } from './students.service';

@Controller('students')
export class StudentsController {
  constructor(private studentsService: StudentsService) {}

  @Get()
  findAll() {
    return this.studentsService.findAll();
  }
}
