# nestjs-logging-lib

A comprehensive logging library for NestJS applications with specialized logging methods for API requests, responses, database queries, and errors.

## Installation

```bash
npm install nestjs-logging-lib
```

## Quick Setup

### 1. Import LoggingModule

```typescript
import { Module } from '@nestjs/common';
import { LoggingModule } from 'nestjs-logging-lib';

@Module({
  imports: [LoggingModule], // Add LoggingModule to imports
})
export class AppModule {}
```

### 2. Inject LoggingService

```typescript
import { Injectable } from '@nestjs/common';
import { LoggingService } from 'nestjs-logging-lib';

@Injectable()
export class YourService {
  constructor(private readonly logger: LoggingService) {}
}
```

## Usage Examples

### Basic Logging Methods

```typescript
// Basic logging methods
this.logger.log('Information log', 'AppService');
this.logger.error('Error log', undefined, 'AppService');
this.logger.warn('Warning log', 'AppService');
this.logger.debug('Debug log', 'AppService');
this.logger.verbose('Verbose log', 'AppService');
```

### API Request Logging

```typescript
import { LoggingService, ApiRequestLog } from 'nestjs-logging-lib';

@Controller('users')
export class UserController {
  constructor(private readonly logger: LoggingService) {}

  @Post()
  async createUser(@Body() userData: any, @Req() req: Request) {
    // Log incoming API request
    this.logger.logApiRequest({
      method: 'POST',
      url: '/users',
      body: userData,
      headers: req.headers,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    }, 'UserController');
  }
}
```

**Output:**
```
[LOG][UserController] [Method=POST] [URL=/users] [Body={"name":"John","email":"john@example.com"}] [Headers={"content-type":"application/json"}] [UserAgent=PostmanRuntime/7.32.3] [IP=::1]
```

### API Response Logging

```typescript
// Log API response
const startTime = Date.now();
const result = await this.userService.create(userData);
const duration = Date.now() - startTime;

this.logger.logApiResponse({
  status: 201,
  duration: duration,
  body: result,
  contentLength: JSON.stringify(result).length,
  timestamp: new Date()
}, 'UserController');
```

**Output:**
```
[LOG][UserController] [Status=201] [Duration=123ms] [Body={"id":1,"name":"John","email":"john@example.com"}] [ContentLength=45] [Timestamp=2025-07-03T10:30:45.123Z]
```

### Database Query Logging

```typescript
import { LoggingService, QueryLog } from 'nestjs-logging-lib';

@Injectable()
export class UserService {
  constructor(private readonly logger: LoggingService) {}

  async findUserById(id: number) {
    const startTime = Date.now();
    
    // Your database operation here
    const user = await this.repository.findOne({ where: { id } });
    
    const duration = Date.now() - startTime;

    // Log the query
    this.logger.logQuery({
      sql: 'SELECT * FROM users WHERE id = ?',
      params: [id],
      duration: duration,
      rows: user ? 1 : 0,
      database: 'app_db',
      table: 'users'
    }, 'UserService');

    return user;
  }
}
```

**Output:**
```
[LOG][UserService] [SQL=SELECT * FROM users WHERE id = ?] [Params=[10]] [Duration=15ms] [Rows=1] [Database=app_db] [Table=users]
```

### Error Logging

```typescript
import { LoggingService, ErrorLog } from 'nestjs-logging-lib';

try {
  // Your code that might throw an error
  await this.riskyOperation();
} catch (error) {
  // Log detailed error information
  this.logger.logError({
    message: error.message,
    exception: error.constructor.name,
    stackTrace: error.stack,
    fileName: 'user.service.ts',
    lineNumber: 45,
    userId: currentUser?.id,
    requestId: req.headers['x-request-id']
  }, 'UserService');
  
  throw error;
}
```

**Output:**
```
[ERROR][UserService] [Message=User not found] [Exception=NotFoundException] [File=user.service.ts] [Line=45] [UserId=123] [RequestId=req-abc-456]
NullPointerException at line 45
  at UserService.findUser(user.service.ts:45)
```

## Type Definitions

### Available Interfaces

```typescript
export interface ApiRequestLog {
  method: string;           // HTTP method (GET, POST, etc.)
  url: string;             // Request URL/endpoint
  body?: any;              // Request payload
  headers?: Record<string, string>; // HTTP headers
  userAgent?: string;      // User agent string
  ip?: string;            // Client IP address
}

export interface ApiResponseLog {
  status: number;          // HTTP status code
  duration: number;        // Response time in milliseconds
  body?: any;             // Response data
  contentLength?: number;  // Response size in bytes
  timestamp?: Date;       // Response timestamp
}

export interface QueryLog {
  sql: string;            // SQL statement
  params?: any[];         // Query parameters
  duration: number;       // Execution time in milliseconds
  rows?: number;          // Number of affected/returned rows
  database?: string;      // Database name
  table?: string;         // Primary table name
}

export interface ErrorLog {
  message: string;        // Error message
  exception?: string;     // Exception type
  stackTrace?: string;    // Full stack trace
  fileName?: string;      // File where error occurred
  lineNumber?: number;    // Line number of error
  userId?: string;        // User ID for context
  requestId?: string;     // Request ID for tracing
}
```

### Constants

```typescript
import { LOG_TYPES } from 'nestjs-logging-lib';

// Available log types
LOG_TYPES.API_REQUEST   // 'API_REQUEST'
LOG_TYPES.API_RESPONSE  // 'API_RESPONSE'
LOG_TYPES.QUERY         // 'QUERY'
LOG_TYPES.ERROR         // 'ERROR'
```

## Complete Example

```typescript
import { Controller, Post, Body, Req } from '@nestjs/common';
import { LoggingService } from 'nestjs-logging-lib';
import { Request } from 'express';

@Controller('attractions')
export class AttractionController {
  constructor(
    private readonly attractionService: AttractionService,
    private readonly logger: LoggingService
  ) {}

  @Post()
  async create(@Body() createDto: any, @Req() req: Request) {
    const startTime = Date.now();

    // Log incoming request
    this.logger.logApiRequest({
      method: 'POST',
      url: '/attractions',
      body: createDto,
      headers: req.headers,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    }, 'AttractionController');

    try {
      const result = await this.attractionService.create(createDto);
      const duration = Date.now() - startTime;

      // Log successful response
      this.logger.logApiResponse({
        status: 201,
        duration: duration,
        body: result,
        timestamp: new Date()
      }, 'AttractionController');

      return result;
    } catch (error) {
      // Log error
      this.logger.logError({
        message: error.message,
        exception: error.constructor.name,
        stackTrace: error.stack,
        fileName: 'attraction.controller.ts',
        requestId: req.headers['x-request-id'] || 'unknown'
      }, 'AttractionController');

      throw error;
    }
  }
}
```

## Features

- ✅ **API Request Logging** - Log HTTP requests with method, URL, body, headers, and client info
- ✅ **API Response Logging** - Log HTTP responses with status, duration, and response data
- ✅ **Database Query Logging** - Log SQL queries with parameters, execution time, and results
- ✅ **Error Logging** - Log errors with detailed stack traces and context information
- ✅ **Global Module** - Available throughout your entire NestJS application
- ✅ **TypeScript Support** - Full type definitions included
- ✅ **Flexible Context** - Add custom context to any log entry

## License

MIT