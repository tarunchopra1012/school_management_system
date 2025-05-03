import {
  Controller,
  Get,
  Param,
  Body,
  Put,
  Post,
  Delete,
  HttpCode,
  HttpStatus,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';

@Controller('students2')
export class StudentsTwoController {
  private students = [
    {
      id: 1,
      username: 'USER 1',
    },
    {
      id: 2,
      username: 'USER 2',
    },
  ];

  @Get()
  findAll() {
    return this.students;
  }

  @Get(':id')
  @HttpCode(200)
  findOne(@Param('id') id: string, @Res() res: Response) {
    const student = this.students.find((s) => s.id === +id);
    if (!student) {
      res.status(HttpStatus.NOT_FOUND).send(`Student with ID ${id} not found`);
    }
    res.send(student);
  }

  @Post()
  @HttpCode(202)
  create(@Body() body): string {
    return `This will create a new student with the following data: ${JSON.stringify(body)}`;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body): string {
    const student = this.students.find((s) => s.id === +id);

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    return `This will update student with ID ${id} with the following data: ${JSON.stringify(body)}`;
  }

  @Delete(':id')
  remove(@Param('id') id: string): string {
    return `This will delete student with ID ${id}`;
  }
}
