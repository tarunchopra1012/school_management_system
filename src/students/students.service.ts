import { Injectable } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { CreateStudentDto } from './dto/create-student.dto';

@Injectable()
export class StudentsService {
  constructor(private readonly emailService: EmailService) {}

  sendEmail() {
    //HERE WE CAN USE this.emailService to send email to specific student
  }

  findAll() {
    //RETURN LIST OF STUDENTS
    return [];
  }

  createStudent(studentData: CreateStudentDto) {
    return `Student ${studentData.fullName} of age ${studentData.age} in grade ${studentData.grade} created!`;
  }
}
