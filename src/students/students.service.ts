import { Injectable } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class StudentsService {
  constructor(private readonly emailService: EmailService) {}
  
  sendEmail() {
    //HERE WE CAN USE this.emailService to send email to specific student
  }

  findAll(){
    //RETURN LIST OF STUDENTS
    return []
  }
}
