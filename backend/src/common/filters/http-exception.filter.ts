import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { Request, Response } from 'express';
import { GraphQLError } from 'graphql';

/**
 * Global exception filter that catches all HttpException instances
 * and formats them into a consistent response structure for HTTP or GraphQL.
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
    // Check if this is a GraphQL context
    if (host.getType<string>() === 'graphql') {
      return this.handleGraphQLError(exception, host);
    }

    // Handle HTTP context
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

  /**
   * Handle HttpException in GraphQL context
   */
  private handleGraphQLError(exception: HttpException, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const info = gqlHost.getInfo();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // Extract error message
    const errorResponse =
      typeof exceptionResponse === 'string'
        ? { message: exceptionResponse }
        : (exceptionResponse as any);

    const message = errorResponse.message || exception.message;

    // Map HTTP status to GraphQL error codes
    let code = 'INTERNAL_SERVER_ERROR';
    if (status === HttpStatus.BAD_REQUEST) {
      code = 'BAD_REQUEST';
    } else if (status === HttpStatus.UNAUTHORIZED) {
      code = 'UNAUTHENTICATED';
    } else if (status === HttpStatus.FORBIDDEN) {
      code = 'FORBIDDEN';
    } else if (status === HttpStatus.NOT_FOUND) {
      code = 'NOT_FOUND';
    } else if (status === HttpStatus.CONFLICT) {
      code = 'CONFLICT';
    }

    // Log the error
    this.logger.warn(
      `GraphQL ${info?.fieldName} error (${status}): ${JSON.stringify(
        message
      )}`,
      exception.stack
    );

    // Throw GraphQL error
    throw new GraphQLError(
      Array.isArray(message) ? message.join('; ') : message,
      {
        extensions: {
          code,
          http: { status },
          ...(Array.isArray(errorResponse.message) && {
            validationErrors: errorResponse.message,
          }),
        },
      }
    );
  }
}
