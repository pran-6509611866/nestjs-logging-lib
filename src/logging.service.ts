import { Injectable, LoggerService } from '@nestjs/common';
import { 
  LOG_TYPES, 
  LogType, 
  ApiRequestLog, 
  ApiResponseLog, 
  QueryLog, 
  ErrorLog 
} from './logging.constants';

@Injectable()
export class LoggingService implements LoggerService {
  
  /**
   * Log API Request
   * แสดง: Method, URL, Request Body, Headers, User Agent, IP Address
   * @param data - ข้อมูล API Request
   * @param context - Context ของการเรียก (เช่น controller name)
   */
  logApiRequest(data: ApiRequestLog, context?: string) {
    const logMessage = this.formatApiRequest(data);
    this.log(logMessage, context || LOG_TYPES.API_REQUEST);
  }

  /**
   * Log API Response  
   * แสดง: Status Code, Response Time, Response Body, Content Length, Timestamp
   * @param data - ข้อมูล API Response
   * @param context - Context ของการเรียก
   */
  logApiResponse(data: ApiResponseLog, context?: string) {
    const logMessage = this.formatApiResponse(data);
    this.log(logMessage, context || LOG_TYPES.API_RESPONSE);
  }

  /**
   * Log Database Query
   * แสดง: SQL Statement, Parameters, Execution Time, Affected Rows, Database/Table
   * @param data - ข้อมูล Query
   * @param context - Context ของการเรียก
   */
  logQuery(data: QueryLog, context?: string) {
    const logMessage = this.formatQuery(data);
    this.log(logMessage, context || LOG_TYPES.QUERY);
  }

  /**
   * Log Error with detailed information
   * แสดง: Error Message, Exception Type, Stack Trace, File/Line, User/Request ID
   * @param data - ข้อมูล Error
   * @param context - Context ของการเรียก
   */
  logError(data: ErrorLog, context?: string) {
    const logMessage = this.formatError(data);
    this.error(logMessage, data.stackTrace, context || LOG_TYPES.ERROR);
  }

  // Private formatting methods
  private formatApiRequest(data: ApiRequestLog): string {
    const parts = [
      `[Method=${data.method}]`,
      `[URL=${data.url}]`,
    ];
    
    if (data.body) {
      parts.push(`[Body=${JSON.stringify(data.body)}]`);
    }
    
    if (data.headers) {
      parts.push(`[Headers=${JSON.stringify(data.headers)}]`);
    }
    
    if (data.userAgent) {
      parts.push(`[UserAgent=${data.userAgent}]`);
    }
    
    if (data.ip) {
      parts.push(`[IP=${data.ip}]`);
    }

    return parts.join(' ');
  }

  private formatApiResponse(data: ApiResponseLog): string {
    const parts = [
      `[Status=${data.status}]`,
      `[Duration=${data.duration}ms]`,
    ];
    
    if (data.body) {
      parts.push(`[Body=${JSON.stringify(data.body)}]`);
    }
    
    if (data.contentLength) {
      parts.push(`[ContentLength=${data.contentLength}]`);
    }
    
    if (data.timestamp) {
      parts.push(`[Timestamp=${data.timestamp.toISOString()}]`);
    }

    return parts.join(' ');
  }

  private formatQuery(data: QueryLog): string {
    const parts = [
      `[SQL=${data.sql}]`,
    ];
    
    if (data.params && data.params.length > 0) {
      parts.push(`[Params=${JSON.stringify(data.params)}]`);
    }
    
    parts.push(`[Duration=${data.duration}ms]`);
    
    if (data.rows !== undefined) {
      parts.push(`[Rows=${data.rows}]`);
    }
    
    if (data.database) {
      parts.push(`[Database=${data.database}]`);
    }
    
    if (data.table) {
      parts.push(`[Table=${data.table}]`);
    }

    return parts.join(' ');
  }

  private formatError(data: ErrorLog): string {
    const parts = [
      `[Message=${data.message}]`,
    ];
    
    if (data.exception) {
      parts.push(`[Exception=${data.exception}]`);
    }
    
    if (data.fileName) {
      parts.push(`[File=${data.fileName}]`);
    }
    
    if (data.lineNumber) {
      parts.push(`[Line=${data.lineNumber}]`);
    }
    
    if (data.userId) {
      parts.push(`[UserId=${data.userId}]`);
    }
    
    if (data.requestId) {
      parts.push(`[RequestId=${data.requestId}]`);
    }

    return parts.join(' ');
  }

  // Original LoggerService methods
  log(message: string, context?: string) {
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