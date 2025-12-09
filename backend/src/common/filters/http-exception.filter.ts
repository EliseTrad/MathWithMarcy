import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Global exception filter that catches all HttpException instances
 * and formats them into a consistent response structure.
 *
 * This filter provides:
 * - Consistent error response format across the application
 * - Detailed logging for debugging
 * - Client-friendly error messages
 * - Request context (path, method, timestamp)
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // Extract error message and details
    const errorResponse =
      typeof exceptionResponse === 'string'
        ? { message: exceptionResponse }
        : (exceptionResponse as any);

    // Build standardized error response
    const errorDetails = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: errorResponse.message || exception.message,
      ...(errorResponse.error && { error: errorResponse.error }),
      ...(Array.isArray(errorResponse.message) && {
        validationErrors: errorResponse.message,
      }),
    };

    // Log error with context
    this.logError(status, errorDetails, exception);

    response.status(status).json(errorDetails);
  }

  /**
   * Logs errors with appropriate level based on status code
   */
  private logError(
    status: number,
    errorDetails: any,
    exception: HttpException
  ) {
    const logContext = {
      path: errorDetails.path,
      method: errorDetails.method,
      statusCode: status,
      message: errorDetails.message,
    };

    // Client errors (4xx) - log as warning
    if (status >= 400 && status < 500) {
      this.logger.warn(
        `Client error: ${JSON.stringify(logContext)}`,
        exception.stack
      );
    }
    // Server errors (5xx) - log as error
    else if (status >= 500) {
      this.logger.error(
        `Server error: ${JSON.stringify(logContext)}`,
        exception.stack
      );
    }
  }
}
