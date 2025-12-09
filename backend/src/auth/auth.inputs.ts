import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import {
  IsStrongPassword,
  IsValidName,
} from '../common/validators/custom.validators';

/**
 * GraphQL Input for User Registration
 */
@InputType()
export class RegisterInput {
  @Field()
  @IsNotEmpty({ message: 'Name is required' })
  @IsValidName({
    message:
      'Name must be between 2-100 characters and contain only letters, spaces, hyphens, and apostrophes',
  })
  name!: string;

  @Field()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @Field()
  @IsNotEmpty({ message: 'Password is required' })
  @IsStrongPassword({
    message:
      'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password!: string;
}

/**
 * GraphQL Input for User Login
 */
@InputType()
export class LoginInput {
  @Field()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @Field()
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(1, { message: 'Password is required' })
  password!: string;
}
