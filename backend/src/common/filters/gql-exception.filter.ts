import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Inject,
} from '@nestjs/common';
import { GqlExceptionFilter, GqlArgumentsHost } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { LoggerService } from '../logger/logger.service';

/**
 * Formats Nest HttpExceptions for GraphQL responses so clients get useful messages.
 *
 * - Extracts validation details produced by class-validator/ValidationPipe
 * - Falls back to the default exception message when no details are present
 * - Preserves HTTP status code under extensions.http.status
 * - Logs errors for debugging and monitoring
 * - Hides sensitive details in production
 */
@Catch()
export class GqlHttpExceptionFilter
  implements GqlExceptionFilter, ExceptionFilter
{
  constructor(@Inject(LoggerService) private readonly logger: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const path = gqlHost.getInfo()?.path?.key;

    // Normalize HttpException vs generic errors
    const isHttp = exception instanceof HttpException;
    const status = isHttp ? exception.getStatus() : 500;
    const response = isHttp
      ? exception.getResponse()
      : { message: (exception as any)?.message ?? 'Unexpected error' };

    // Prefer detailed validation messages when available
    let message = isHttp
      ? exception.message
      : (exception as any)?.message ?? 'Unexpected error';

    if (typeof response === 'string') {
      message = response;
    } else if (typeof response === 'object' && response !== null) {
      const respMessage = (response as any).message;
      const respError = (response as any).error;

      if (Array.isArray(respMessage)) {
        // Handle arrays of strings or ValidationError objects
        const flattened = respMessage
          .map((item: unknown) => {
            if (typeof item === 'string') return item;
            if (
              item &&
              typeof item === 'object' &&
              'constraints' in (item as any) &&
              (item as any).constraints
            ) {
              return Object.values((item as any).constraints).join('; ');
            }
            return String(item);
          })
          .filter(Boolean);

        if (flattened.length > 0) {
          message = flattened.join('; ');
        }
      } else if (respMessage) {
        message = String(respMessage);
      } else if (respError) {
        message = String(respError);
      }
    }

    // For client errors, return the actionable message; for server errors, hide details
    const isClientError = status >= 400 && status < 500;
    const clientFacingMessage = isClientError
      ? message
      : 'Something went wrong. Please try again later.';

    // Log error with context
    this.logger.logError(
      exception as Error,
      {
        path,
        status,
        isClientError,
        originalMessage: message,
      },
      'GraphQLException'
    );

    // Build extensions - only include detailed response in development
    const extensions: Record<string, any> = {
      code: isHttp ? exception.name : 'INTERNAL_SERVER_ERROR',
      http: { status },
    };

    // Only expose full response details in non-production environments
    if (process.env.NODE_ENV !== 'production') {
      extensions.response = response;
    }

    return new GraphQLError(clientFacingMessage, {
      extensions,
      path: path ? [path] : undefined,
      originalError: exception as Error,
      nodes: gqlHost.getInfo()?.fieldNodes,
      source: gqlHost.getInfo()?.fieldNodes?.[0]?.loc?.source,
      positions: gqlHost.getInfo()?.fieldNodes?.[0]?.loc
        ? [gqlHost.getInfo().fieldNodes[0].loc.start]
        : undefined,
    });
  }
}
