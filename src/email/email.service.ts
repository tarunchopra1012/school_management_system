import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  sendEmail(to: string, content: string){
    //SEND EMAIL
  }
}
