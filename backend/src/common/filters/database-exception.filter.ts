import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { Request, Response } from 'express';
import { QueryFailedError, EntityNotFoundError, TypeORMError } from 'typeorm';
import { GraphQLError } from 'graphql';

/**
 * Database exception filter that catches TypeORM errors and transforms them
 * into user-friendly HTTP responses (REST) or GraphQL errors.
 *
 * Handles common database errors:
 * - Unique constraint violations (duplicate entries)
 * - Foreign key constraint violations
 * - Not null constraint violations
 * - Entity not found errors
 * - Connection errors
 * - Generic query failures
 */
@Catch(QueryFailedError, EntityNotFoundError, TypeORMError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DatabaseExceptionFilter.name);

  catch(exception: TypeORMError, host: ArgumentsHost) {
    // Check if this is a GraphQL context
    if (host.getType<string>() === 'graphql') {
      return this.handleGraphQLError(exception, host);
    }

    // Handle HTTP context
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'An unexpected database error occurred';
    let error = 'Database Error';

    // Handle QueryFailedError (most common database errors)
    if (exception instanceof QueryFailedError) {
      const dbError = this.handleQueryFailedError(exception);
      status = dbError.status;
      message = dbError.message;
      error = dbError.error;
    }
    // Handle EntityNotFoundError
    else if (exception instanceof EntityNotFoundError) {
      status = HttpStatus.NOT_FOUND;
      message = 'The requested resource was not found';
      error = 'Not Found';
    }
    // Generic TypeORM errors
    else {
      this.logger.error(
        `Unhandled TypeORM error: ${exception.message}`,
        exception.stack
      );
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error,
      message,
    };

    // Log the error
    this.logger.error(
      `Database error: ${JSON.stringify({
        path: request.url,
        method: request.method,
        error: message,
        originalError: exception.message,
      })}`,
      exception.stack
    );

    response.status(status).json(errorResponse);
  }

  /**
   * Handles QueryFailedError and extracts specific constraint violations
   */
  private handleQueryFailedError(exception: QueryFailedError): {
    status: number;
    message: string;
    error: string;
  } {
    const driverError = exception.driverError as any;
    const errorCode = driverError?.code;

    // PostgreSQL error codes
    switch (errorCode) {
      case '23505': // unique_violation
        return {
          status: HttpStatus.CONFLICT,
          message: this.extractUniqueConstraintMessage(driverError),
          error: 'Duplicate Entry',
        };

      case '23503': // foreign_key_violation
        return {
          status: HttpStatus.BAD_REQUEST,
          message:
            'Cannot perform this operation due to related data constraints',
          error: 'Foreign Key Violation',
        };

      case '23502': // not_null_violation
        return {
          status: HttpStatus.BAD_REQUEST,
          message: this.extractNotNullMessage(driverError),
          error: 'Missing Required Field',
        };

      case '22P02': // invalid_text_representation
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Invalid data format provided',
          error: 'Invalid Input',
        };

      case '42P01': // undefined_table
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Database configuration error',
          error: 'Configuration Error',
        };

      case '28P01': // invalid_password
      case '28000': // invalid_authorization_specification
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Database authentication failed',
          error: 'Database Connection Error',
        };

      case '53300': // too_many_connections
        return {
          status: HttpStatus.SERVICE_UNAVAILABLE,
          message: 'Database is currently unavailable. Please try again later',
          error: 'Service Unavailable',
        };

      default:
        this.logger.error(
          `Unhandled database error code: ${errorCode}`,
          exception.stack
        );
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An unexpected database error occurred',
          error: 'Database Error',
        };
    }
  }

  /**
   * Extracts user-friendly message from unique constraint violation
   */
  private extractUniqueConstraintMessage(driverError: any): string {
    const detail = driverError.detail || '';
    const constraint = driverError.constraint || '';

    // Try to extract field name from constraint
    if (constraint.includes('email')) {
      return 'This email address is already registered';
    }

    // Generic message if we can't determine the field
    if (detail) {
      // Remove technical details but keep the field info
      const match = detail.match(/Key \(([^)]+)\)=/);
      if (match) {
        const field = match[1];
        return `A record with this ${field} already exists`;
      }
    }

    return 'This record already exists in the database';
  }

  /**
   * Extracts user-friendly message from not null violation
   */
  private extractNotNullMessage(driverError: any): string {
    const column = driverError.column;

    if (column) {
      // Convert snake_case to readable format
      const fieldName = column.replace(/_/g, ' ');
      return `The field '${fieldName}' is required and cannot be empty`;
    }

    return 'A required field is missing';
  }

  /**
   * Handle database errors in GraphQL context
   */
  private handleGraphQLError(exception: TypeORMError, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const info = gqlHost.getInfo();

    let message = 'An unexpected database error occurred';
    let code = 'INTERNAL_SERVER_ERROR';

    // Handle QueryFailedError
    if (exception instanceof QueryFailedError) {
      const dbError = this.handleQueryFailedError(exception);
      message = dbError.message;

      // Map HTTP status to GraphQL error codes
      if (dbError.status === HttpStatus.CONFLICT) {
        code = 'CONFLICT';
      } else if (dbError.status === HttpStatus.BAD_REQUEST) {
        code = 'BAD_REQUEST';
      }
    }
    // Handle EntityNotFoundError
    else if (exception instanceof EntityNotFoundError) {
      message = 'The requested resource was not found';
      code = 'NOT_FOUND';
    }
    // Generic TypeORM errors
    else {
      this.logger.error(
        `Unhandled TypeORM error in GraphQL: ${exception.message}`,
        exception.stack
      );
    }

    // Log the error
    this.logger.error(
      `Database error in GraphQL ${info?.fieldName}: ${message}`,
      exception.stack
    );

    // Throw GraphQL error
    throw new GraphQLError(message, {
      extensions: {
        code,
        exception: {
          message: exception.message,
        },
      },
    });
  }
}
