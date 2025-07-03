# nestjs-logging-lib

A reusable logging library for NestJS.

## Installation

```bash
npm install nestjs-logging-lib
```

## Usage

```typescript
import { LoggingModule, LoggingService } from 'nestjs-logging-lib';

@Module({
  imports: [LoggingModule], // Import Module
})
export class AppModule {}

@Injectable()
export class AppService {
  constructor(private readonly logger: LoggingService) {}

  someMethod() {
    this.logger.log('Information log', 'AppService');
    this.logger.error('Error log', undefined, 'AppService');
    this.logger.warn('Warning log', 'AppService');
    this.logger.debug('Debug log', 'AppService');
    this.logger.verbose('Verbose log', 'AppService');
  }
}
```