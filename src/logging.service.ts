import { Injectable, LoggerService } from '@nestjs/common';
import { 
  LOG_TYPES, 
  LogType, 
  ApiRequestLog, 
  ApiResponseLog, 
  QueryLog, 
  ErrorLog 
} from './logging.constants';

/**
 * LoggingService
 * 
 * A reusable and configurable logging service for NestJS applications.
 * Provides specialized logging methods for API requests, responses, database queries, and errors.
 * 
 * @example
 * ```typescript
 * constructor(private readonly logger: LoggingService) {}
 * 
 * // Basic logging
 * this.logger.log('Hello world', 'AppController');
 * 
 * // API Request logging
 * this.logger.logApiRequest({
 *   method: 'POST',
 *   url: '/users',
 *   body: { name: 'John' }
 * }, 'UserController');
 * ```
 */
@Injectable()
export class LoggingService implements LoggerService {
  
  /**
   * Log API Request information
   * 
   * Logs detailed information about incoming HTTP requests including:
   * - HTTP method (GET, POST, PUT, DELETE, etc.)
   * - Request URL/endpoint
   * - Request body/payload
   * - HTTP headers
   * - User agent information
   * - Client IP address
   * 
   * @param data - API request data to log
   * @param context - Optional context string (e.g., controller name)
   * 
   * @example
   * ```typescript
   * this.logger.logApiRequest({
   *   method: 'POST',
   *   url: '/api/users',
   *   body: { name: 'John', email: 'john@example.com' },
   *   headers: req.headers,
   *   userAgent: req.get('User-Agent'),
   *   ip: req.ip
   * }, 'UserController');
   * ```
   * 
   * Output: `[LOG][UserController] [Method=POST] [URL=/api/users] [Body={"name":"John","email":"john@example.com"}] [Headers={"content-type":"application/json"}] [UserAgent=PostmanRuntime/7.32.3] [IP=::1]`
   */
  logApiRequest(data: ApiRequestLog, context?: string) {
    const logMessage = this.formatApiRequest(data);
    this.log(logMessage, context || LOG_TYPES.API_REQUEST);
  }

  /**
   * Log API Response information
   * 
   * Logs detailed information about outgoing HTTP responses including:
   * - HTTP status code
   * - Response processing time in milliseconds
   * - Response body/data
   * - Content length in bytes
   * - Response timestamp
   * 
   * @param data - API response data to log
   * @param context - Optional context string (e.g., controller name)
   * 
   * @example
   * ```typescript
   * this.logger.logApiResponse({
   *   status: 200,
   *   duration: 145,
   *   body: { id: 1, name: 'John', email: 'john@example.com' },
   *   contentLength: 1024,
   *   timestamp: new Date()
   * }, 'UserController');
   * ```
   * 
   * Output: `[LOG][UserController] [Status=200] [Duration=145ms] [Body={"id":1,"name":"John","email":"john@example.com"}] [ContentLength=1024] [Timestamp=2025-07-03T10:30:45.123Z]`
   */
  logApiResponse(data: ApiResponseLog, context?: string) {
    const logMessage = this.formatApiResponse(data);
    this.log(logMessage, context || LOG_TYPES.API_RESPONSE);
  }

  /**
   * Log Database Query information
   * 
   * Logs detailed information about database operations including:
   * - SQL statement or query
   * - Query parameters/bindings
   * - Execution time in milliseconds
   * - Number of affected/returned rows
   * - Database name
   * - Primary table name
   * 
   * @param data - Database query data to log
   * @param context - Optional context string (e.g., service name)
   * 
   * @example
   * ```typescript
   * this.logger.logQuery({
   *   sql: 'SELECT * FROM users WHERE age > ? AND city = ?',
   *   params: [25, 'Bangkok'],
   *   duration: 15,
   *   rows: 42,
   *   database: 'app_db',
   *   table: 'users'
   * }, 'UserService');
   * ```
   * 
   * Output: `[LOG][UserService] [SQL=SELECT * FROM users WHERE age > ? AND city = ?] [Params=[25,"Bangkok"]] [Duration=15ms] [Rows=42] [Database=app_db] [Table=users]`
   */
  logQuery(data: QueryLog, context?: string) {
    const logMessage = this.formatQuery(data);
    this.log(logMessage, context || LOG_TYPES.QUERY);
  }

  /**
   * Log Error information with detailed context
   * 
   * Logs comprehensive error information including:
   * - Error message
   * - Exception type/name
   * - Full stack trace
   * - Source file name
   * - Line number where error occurred
   * - User ID for context
   * - Request ID for tracing
   * 
   * @param data - Error data to log
   * @param context - Optional context string (e.g., service name)
   * 
   * @example
   * ```typescript
   * try {
   *   await this.riskyOperation();
   * } catch (error) {
   *   this.logger.logError({
   *     message: error.message,
   *     exception: error.constructor.name,
   *     stackTrace: error.stack,
   *     fileName: 'user.service.ts',
   *     lineNumber: 45,
   *     userId: currentUser?.id,
   *     requestId: req.headers['x-request-id']
   *   }, 'UserService');
   *   throw error;
   * }
   * ```
   * 
   * Output: `[ERROR][UserService] [Message=User not found] [Exception=NotFoundException] [File=user.service.ts] [Line=45] [UserId=123] [RequestId=req-abc-456]`
   */
  logError(data: ErrorLog, context?: string) {
    const logMessage = this.formatError(data);
    this.error(logMessage, data.stackTrace, context || LOG_TYPES.ERROR);
  }

  // ...existing private methods...

  /**
   * Log an informational message
   * @param message - The message to log
   * @param context - Optional context for the log
   */
  log(message: string, context?: string) {
    console.log(`[LOG]${context ? '[' + context + ']' : ''} ${message}`);
  }

  /**
   * Log an error message with optional stack trace
   * @param message - The error message to log
   * @param trace - Optional stack trace
   * @param context - Optional context for the log
   */
  error(message: string, trace?: string, context?: string) {
    console.error(`[ERROR]${context ? '[' + context + ']' : ''} ${message}`);
    if (trace) {
      console.error(trace);
    }
  }

  /**
   * Log a warning message
   * @param message - The warning message to log
   * @param context - Optional context for the log
   */
  warn(message: string, context?: string) {
    console.warn(`[WARN]${context ? '[' + context + ']' : ''} ${message}`);
  }

  /**
   * Log a debug message
   * @param message - The debug message to log
   * @param context - Optional context for the log
   */
  debug?(message: string, context?: string) {
    console.debug(`[DEBUG]${context ? '[' + context + ']' : ''} ${message}`);
  }

  /**
   * Log a verbose message
   * @param message - The verbose message to log
   * @param context - Optional context for the log
   */
  verbose?(message: string, context?: string) {
    console.info(`[VERBOSE]${context ? '[' + context + ']' : ''} ${message}`);
  }

  /**
   * Format API request data for logging
   * @private
   */
  private formatApiRequest(data: ApiRequestLog): string {
    const parts = [];
    if (data.method) parts.push(`[Method=${data.method}]`);
    if (data.url) parts.push(`[URL=${data.url}]`);
    if (data.body) parts.push(`[Body=${JSON.stringify(data.body)}]`);
    if (data.headers) parts.push(`[Headers=${JSON.stringify(data.headers)}]`);
    if (data.userAgent) parts.push(`[UserAgent=${data.userAgent}]`);
    if (data.ip) parts.push(`[IP=${data.ip}]`);
    return parts.join(' ');
  }

  /**
   * Format API response data for logging
   * @private
   */
  private formatApiResponse(data: ApiResponseLog): string {
    const parts = [];
    if (data.status) parts.push(`[Status=${data.status}]`);
    if (data.duration) parts.push(`[Duration=${data.duration}ms]`);
    if (data.body) parts.push(`[Body=${JSON.stringify(data.body)}]`);
    if (data.contentLength) parts.push(`[ContentLength=${data.contentLength}]`);
    if (data.timestamp) parts.push(`[Timestamp=${data.timestamp.toISOString()}]`);
    return parts.join(' ');
  }

  /**
   * Format query data for logging
   * @private
   */
  private formatQuery(data: QueryLog): string {
    const parts = [];
    if (data.sql) parts.push(`[SQL=${data.sql}]`);
    if (data.params) parts.push(`[Params=${JSON.stringify(data.params)}]`);
    if (data.duration) parts.push(`[Duration=${data.duration}ms]`);
    if (data.rows) parts.push(`[Rows=${data.rows}]`);
    if (data.database) parts.push(`[Database=${data.database}]`);
    if (data.table) parts.push(`[Table=${data.table}]`);
    return parts.join(' ');
  }

  /**
   * Format error data for logging
   * @private
   */
  private formatError(data: ErrorLog): string {
    const parts = [];
    if (data.message) parts.push(`[Message=${data.message}]`);
    if (data.exception) parts.push(`[Exception=${data.exception}]`);
    if (data.fileName) parts.push(`[File=${data.fileName}]`);
    if (data.lineNumber) parts.push(`[Line=${data.lineNumber}]`);
    if (data.userId) parts.push(`[UserId=${data.userId}]`);
    if (data.requestId) parts.push(`[RequestId=${data.requestId}]`);
    return parts.join(' ');
  }
}