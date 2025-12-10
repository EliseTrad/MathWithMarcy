/**
 * Centralized validation messages for frontend validation.
 * Must match backend validation messages for consistency.
 */

export const VALIDATION_MESSAGES = {
  // User/Auth validation
  NAME_REQUIRED: 'Name is required.',
  NAME_MIN_LENGTH: 'Name must be at least 2 characters long.',

  EMAIL_REQUIRED: 'Email is required.',
  EMAIL_INVALID: 'Please provide a valid email address.',

  PASSWORD_REQUIRED: 'Password is required.',
  PASSWORD_MIN_LENGTH: 'Password must be at least 8 characters long.',
  PASSWORD_MISMATCH: 'Passwords do not match.',
  PASSWORD_CONFIRM_REQUIRED: 'Please confirm your password.',

  // Answer validation
  ANSWER_REQUIRED: 'Answer is required.',
} as const;

/**
 * Extract user-friendly error message from Apollo error
 */
export function extractErrorMessage(error: unknown): string {
  // Handle Apollo GraphQL errors
  if (error && typeof error === 'object' && 'graphQLErrors' in error) {
    const gqlError = error as {
      graphQLErrors?: Array<{ message?: string }>;
      networkError?: { message?: string };
    };

    // Get first GraphQL error
    if (gqlError.graphQLErrors && gqlError.graphQLErrors.length > 0) {
      const firstError = gqlError.graphQLErrors[0];
      return firstError.message || 'An error occurred';
    }

    // Get network error
    if (gqlError.networkError) {
      const netError = gqlError.networkError;
      return netError.message || 'Network error occurred';
    }
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return error.message;
  }

  // Fallback
  return 'An unexpected error occurred';
}

/**
 * Check if error indicates authentication failure
 */
export function isAuthError(error: unknown): boolean {
  const message = extractErrorMessage(error).toLowerCase();
  return (
    message.includes('unauthorized') ||
    message.includes('authentication') ||
    message.includes('token') ||
    message.includes('session expired')
  );
}
