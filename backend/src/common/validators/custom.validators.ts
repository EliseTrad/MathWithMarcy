import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

/**
 * Custom validator to ensure passwords meet security requirements:
 * - At least 8 characters
 * - Contains at least one uppercase letter
 * - Contains at least one lowercase letter
 * - Contains at least one number
 * - Contains at least one special character
 */
@ValidatorConstraint({ name: 'isStrongPassword', async: false })
export class IsStrongPasswordConstraint
  implements ValidatorConstraintInterface
{
  validate(password: string, args: ValidationArguments) {
    if (!password || typeof password !== 'string') {
      return false;
    }

    // At least 8 characters
    if (password.length < 8) {
      return false;
    }

    // Contains uppercase letter
    if (!/[A-Z]/.test(password)) {
      return false;
    }

    // Contains lowercase letter
    if (!/[a-z]/.test(password)) {
      return false;
    }

    // Contains number
    if (!/\d/.test(password)) {
      return false;
    }

    // Contains special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character';
  }
}

/**
 * Decorator for strong password validation
 */
export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsStrongPasswordConstraint,
    });
  };
}

/**
 * Custom validator to check if a value is a valid question difficulty
 */
@ValidatorConstraint({ name: 'isValidDifficulty', async: false })
export class IsValidDifficultyConstraint
  implements ValidatorConstraintInterface
{
  private validDifficulties = ['Easy', 'Medium', 'Hard'];

  validate(difficulty: string, args: ValidationArguments) {
    if (!difficulty || typeof difficulty !== 'string') {
      return false;
    }
    return this.validDifficulties.includes(difficulty);
  }

  defaultMessage(args: ValidationArguments) {
    return `Difficulty must be one of: ${this.validDifficulties.join(', ')}`;
  }
}

/**
 * Decorator for valid difficulty validation
 */
export function IsValidDifficulty(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidDifficultyConstraint,
    });
  };
}

/**
 * Custom validator to check if a value is a valid question topic
 */
@ValidatorConstraint({ name: 'isValidTopic', async: false })
export class IsValidTopicConstraint implements ValidatorConstraintInterface {
  private validTopics = ['Geometry', 'Algebra', 'Arithmetic', 'WordProblem'];

  validate(topic: string, args: ValidationArguments) {
    if (!topic || typeof topic !== 'string') {
      return false;
    }
    return this.validTopics.includes(topic);
  }

  defaultMessage(args: ValidationArguments) {
    return `Topic must be one of: ${this.validTopics.join(', ')}`;
  }
}

/**
 * Decorator for valid topic validation
 */
export function IsValidTopic(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidTopicConstraint,
    });
  };
}

/**
 * Custom validator to ensure names don't contain numbers or special characters
 */
@ValidatorConstraint({ name: 'isValidName', async: false })
export class IsValidNameConstraint implements ValidatorConstraintInterface {
  validate(name: string, args: ValidationArguments) {
    if (!name || typeof name !== 'string') {
      return false;
    }

    // Allow letters, spaces, hyphens, and apostrophes
    const namePattern = /^[a-zA-Z\s\-']+$/;
    return namePattern.test(name);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Name can only contain letters, spaces, hyphens, and apostrophes';
  }
}

/**
 * Decorator for valid name validation
 */
export function IsValidName(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidNameConstraint,
    });
  };
}
