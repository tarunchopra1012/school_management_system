import { Module } from '@nestjs/common';
import { DbConfigService } from './config-db.service';

@Module({
  providers: [DbConfigService],
  exports: [DbConfigService],
})
export class CommonModule {}
