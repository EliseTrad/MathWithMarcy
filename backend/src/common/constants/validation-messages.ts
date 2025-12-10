/**
 * Centralized validation messages for consistent error feedback
 * across backend validation and frontend client-side validation.
 *
 * Using these constants ensures users see the same messages regardless
 * of where validation occurs.
 */

export const VALIDATION_MESSAGES = {
  // User/Auth validation
  NAME_REQUIRED: 'Name is required.',
  NAME_MIN_LENGTH: 'Name must be at least 2 characters long.',
  NAME_MAX_LENGTH: 'Name must not exceed 100 characters.',

  EMAIL_REQUIRED: 'Email is required.',
  EMAIL_INVALID: 'Please provide a valid email address.',
  EMAIL_MAX_LENGTH: 'Email must not exceed 150 characters.',
  EMAIL_ALREADY_EXISTS: 'Email is already registered.',

  PASSWORD_REQUIRED: 'Password is required.',
  PASSWORD_MIN_LENGTH: 'Password must be at least 8 characters long.',
  PASSWORD_MAX_LENGTH: 'Password must not exceed 255 characters.',
  PASSWORD_STRONG:
    'Password must contain uppercase, lowercase, number, and special character.',
  PASSWORD_MISMATCH: 'Passwords do not match.',
  PASSWORD_CONFIRM_REQUIRED: 'Please confirm your password.',

  // Question validation
  QUESTION_TEXT_REQUIRED: 'Question text is required.',
  QUESTION_TEXT_MAX_LENGTH: 'Question text must not exceed 1000 characters.',
  CORRECT_ANSWER_REQUIRED: 'Correct answer is required.',
  CORRECT_ANSWER_MAX_LENGTH: 'Correct answer must not exceed 255 characters.',
  HINT_MAX_LENGTH: 'Hint must not exceed 500 characters.',

  TOPIC_REQUIRED: 'Topic is required.',
  TOPIC_INVALID:
    'Topic must be one of: Geometry, Algebra, Arithmetic, WordProblem.',

  DIFFICULTY_REQUIRED: 'Difficulty is required.',
  DIFFICULTY_INVALID: 'Difficulty must be one of: Easy, Medium, Hard.',

  // Answer validation
  ANSWER_REQUIRED: 'Answer is required.',
  ANSWER_MAX_LENGTH: 'Answer cannot exceed 255 characters.',

  // Generic validation
  ID_INVALID: 'Invalid ID provided.',
  FIELD_REQUIRED: 'This field is required.',
  FIELD_MUST_BE_STRING: 'This field must be a text value.',
  FIELD_MUST_BE_NUMBER: 'This field must be a number.',
} as const;

/**
 * Error messages for common business logic errors
 */
export const ERROR_MESSAGES = {
  // Authentication
  INVALID_CREDENTIALS:
    'Invalid email or password. Please check your credentials and try again.',
  UNAUTHORIZED: 'You must be logged in to access this resource.',
  TOKEN_EXPIRED: 'Your session has expired. Please log in again.',

  // User operations
  USER_NOT_FOUND: 'User not found.',
  USER_CREATE_FAILED: 'Unable to create user. Please try again later.',
  USER_UPDATE_FAILED: 'Unable to update user. Please try again later.',
  USER_DELETE_FAILED: 'Unable to delete user. Please try again later.',

  // Question operations
  QUESTION_NOT_FOUND: 'Question not found.',
  QUESTION_CREATE_FAILED: 'Unable to create question. Please try again later.',
  QUESTION_UPDATE_FAILED: 'Unable to update question. Please try again later.',
  QUESTIONS_FETCH_FAILED: 'Unable to load questions. Please try again.',

  // Answer operations
  ANSWER_SUBMIT_FAILED: 'Unable to submit answer. Please try again.',
  ANSWER_INVALID: 'The answer provided is not correct.',

  // Generic errors
  INTERNAL_SERVER_ERROR: 'Something went wrong. Please try again later.',
  DATABASE_ERROR: 'An unexpected database error occurred.',
  VALIDATION_FAILED: 'Please check your input and try again.',
} as const;
