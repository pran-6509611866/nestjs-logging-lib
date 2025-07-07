/**
 * Log type constants for categorizing different types of logs
 */
export const LOG_TYPES = {
  /** API Request logging */
  API_REQUEST: 'API_REQUEST',
  /** API Response logging */
  API_RESPONSE: 'API_RESPONSE', 
  /** Database Query logging */
  QUERY: 'QUERY',
  /** Error logging */
  ERROR: 'ERROR',
} as const;

export type LogType = typeof LOG_TYPES[keyof typeof LOG_TYPES];

/**
 * Interface for logging API request information
 */
export interface ApiRequestLog {
  /** HTTP method (GET, POST, PUT, DELETE, etc.) */
  method: string;
  /** Request URL/endpoint */
  url: string;
  /** Request body/payload (optional) */
  body?: any;
  /** HTTP headers (optional) */
  headers?: Record<string, string>;
  /** User agent string (optional) */
  userAgent?: string;
  /** Client IP address (optional) */
  ip?: string;
}

/**
 * Interface for logging API response information
 */
export interface ApiResponseLog {
  /** HTTP status code */
  status: number;
  /** Response processing time in milliseconds */
  duration: number;
  /** Response body/data (optional) */
  body?: any;
  /** Content length in bytes (optional) */
  contentLength?: number;
  /** Response timestamp (optional) */
  timestamp?: Date;
}

/**
 * Interface for logging database query information
 */
export interface QueryLog {
  /** SQL statement or query */
  sql: string;
  /** Query parameters/bindings (optional) */
  params?: any[];
  /** Query execution time in milliseconds */
  duration: number;
  /** Number of affected/returned rows (optional) */
  rows?: number;
  /** Database name (optional) */
  database?: string;
  /** Primary table name (optional) */
  table?: string;
}

/**
 * Interface for logging error information
 */
export interface ErrorLog {
  /** Error message */
  message: string;
  /** Exception type/name (optional) */
  exception?: string;
  /** Full stack trace (optional) */
  stackTrace?: string;
  /** Source file name (optional) */
  fileName?: string;
  /** Line number where error occurred (optional) */
  lineNumber?: number;
  /** User ID for context (optional) */
  userId?: string;
  /** Request ID for tracing (optional) */
  requestId?: string;
}