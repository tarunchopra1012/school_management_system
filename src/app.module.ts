import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentsModule } from './students/students.module';
import { ClassesModule } from './classes/classes.module';
import { EmailModule } from './email/email.module';
import { ConfigService } from './common/config.service';

@Module({
  imports: [StudentsModule, ClassesModule, EmailModule],
  controllers: [AppController],
  providers: [AppService, ConfigService],
  exports: [ConfigService],
})
export class AppModule {}
