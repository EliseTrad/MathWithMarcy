/**
 * Standardized Error Codes for GraphQL API
 * Use in exception extensions for client-side error handling
 */
export enum ErrorCode {
  // Authentication & Authorization
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  UNAUTHORIZED = 'UNAUTHORIZED',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',

  // User Management
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  INVALID_USER_ID = 'INVALID_USER_ID',
  WEAK_PASSWORD = 'WEAK_PASSWORD',
  INCORRECT_PASSWORD = 'INCORRECT_PASSWORD',

  // Questions
  QUESTION_NOT_FOUND = 'QUESTION_NOT_FOUND',
  INVALID_QUESTION_ID = 'INVALID_QUESTION_ID',
  INVALID_TOPIC = 'INVALID_TOPIC',
  INVALID_DIFFICULTY = 'INVALID_DIFFICULTY',

  // Validation
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',

  // Server Errors
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
}

/**
 * Create a structured error with code and metadata
 */
export function createGraphQLError(
  message: string,
  code: ErrorCode,
  metadata?: Record<string, any>
) {
  return {
    message,
    extensions: {
      code,
      ...metadata,
    },
  };
}
