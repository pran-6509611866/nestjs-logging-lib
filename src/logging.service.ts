import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class LoggingService implements LoggerService {
  log(message: string, context?: string) {
    // คุณสามารถปรับให้เก็บลงไฟล์ หรือ DB ได้ตามต้องการ
    console.log(`[LOG]${context ? '[' + context + ']' : ''} ${message}`);
  }

  error(message: string, trace?: string, context?: string) {
    console.error(`[ERROR]${context ? '[' + context + ']' : ''} ${message}`);
    if (trace) {
      console.error(trace);
    }
  }

  warn(message: string, context?: string) {
    console.warn(`[WARN]${context ? '[' + context + ']' : ''} ${message}`);
  }

  debug?(message: string, context?: string) {
    console.debug(`[DEBUG]${context ? '[' + context + ']' : ''} ${message}`);
  }

  verbose?(message: string, context?: string) {
    console.info(`[VERBOSE]${context ? '[' + context + ']' : ''} ${message}`);
  }
}