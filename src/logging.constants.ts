export const LOG_TYPES = {
  API_REQUEST: 'API_REQUEST',
  API_RESPONSE: 'API_RESPONSE', 
  QUERY: 'QUERY',
  ERROR: 'ERROR',
} as const;

export type LogType = typeof LOG_TYPES[keyof typeof LOG_TYPES];

// Interface สำหรับแต่ละประเภท log
export interface ApiRequestLog {
  method: string;
  url: string;
  body?: any;
  headers?: Record<string, string>;
  userAgent?: string;
  ip?: string;
}

export interface ApiResponseLog {
  status: number;
  duration: number;
  body?: any;
  contentLength?: number;
  timestamp?: Date;
}

export interface QueryLog {
  sql: string;
  params?: any[];
  duration: number;
  rows?: number;
  database?: string;
  table?: string;
}

export interface ErrorLog {
  message: string;
  exception?: string;
  stackTrace?: string;
  fileName?: string;
  lineNumber?: number;
  userId?: string;
  requestId?: string;
}