import { Global, Module } from '@nestjs/common';
import { LoggingService } from './logging.service';

@Global() // ทำให้ใช้งานได้ทั่วทั้งแอปโดยไม่ต้อง import ซ้ำ
@Module({
  providers: [LoggingService],
  exports: [LoggingService],
})
export class LoggingModule {}