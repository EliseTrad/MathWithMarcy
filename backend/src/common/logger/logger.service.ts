import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';

/**
 * Custom Logger Service for structured logging across the application.
 *
 * Provides consistent logging with context information for:
 * - Error tracking and debugging
 * - Performance monitoring
 * - Audit trails
 * - Security events
 *
 * In production, this should be integrated with a logging service
 * like Winston, Pino, or cloud logging (CloudWatch, Stackdriver, etc.)
 */
@Injectable()
export class LoggerService implements NestLoggerService {
  /**
   * Log general informational messages
   */
  log(message: string, context?: string) {
    const timestamp = new Date().toISOString();
    console.log(
      `[${timestamp}] [INFO] ${context ? `[${context}] ` : ''}${message}`
    );
  }

  /**
   * Log error messages with optional stack trace and context
   */
  error(message: string, trace?: string, context?: string) {
    const timestamp = new Date().toISOString();
    console.error(
      `[${timestamp}] [ERROR] ${context ? `[${context}] ` : ''}${message}`
    );
    if (trace) {
      console.error(`Stack trace: ${trace}`);
    }
  }

  /**
   * Log warning messages
   */
  warn(message: string, context?: string) {
    const timestamp = new Date().toISOString();
    console.warn(
      `[${timestamp}] [WARN] ${context ? `[${context}] ` : ''}${message}`
    );
  }

  /**
   * Log debug messages (only in development)
   */
  debug(message: string, context?: string) {
    if (process.env.NODE_ENV !== 'production') {
      const timestamp = new Date().toISOString();
      console.debug(
        `[${timestamp}] [DEBUG] ${context ? `[${context}] ` : ''}${message}`
      );
    }
  }

  /**
   * Log verbose messages (only in development)
   */
  verbose(message: string, context?: string) {
    if (process.env.NODE_ENV !== 'production') {
      const timestamp = new Date().toISOString();
      console.log(
        `[${timestamp}] [VERBOSE] ${context ? `[${context}] ` : ''}${message}`
      );
    }
  }

  /**
   * Log structured error with metadata
   */
  logError(error: Error, metadata?: Record<string, any>, context?: string) {
    const timestamp = new Date().toISOString();
    console.error(
      `[${timestamp}] [ERROR] ${context ? `[${context}] ` : ''}${
        error.message
      }`,
      {
        name: error.name,
        stack: error.stack,
        ...metadata,
      }
    );
  }

  /**
   * Log HTTP request/response for debugging
   */
  logHttpRequest(
    method: string,
    url: string,
    statusCode: number,
    responseTime?: number
  ) {
    const timestamp = new Date().toISOString();
    const timeInfo = responseTime ? ` - ${responseTime}ms` : '';
    console.log(
      `[${timestamp}] [HTTP] ${method} ${url} ${statusCode}${timeInfo}`
    );
  }

  /**
   * Log database operations
   */
  logDatabaseOperation(
    operation: string,
    entity: string,
    duration?: number,
    error?: Error
  ) {
    const timestamp = new Date().toISOString();
    if (error) {
      console.error(
        `[${timestamp}] [DATABASE] ${operation} ${entity} failed: ${error.message}`
      );
    } else {
      const durationInfo = duration ? ` (${duration}ms)` : '';
      console.log(
        `[${timestamp}] [DATABASE] ${operation} ${entity}${durationInfo}`
      );
    }
  }
}
