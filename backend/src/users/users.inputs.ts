import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { IsValidName } from '../common/validators/custom.validators';

/**
 * GraphQL Input for Updating User Profile
 */
@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsValidName({
    message:
      'Name must be between 2-100 characters and contain only letters, spaces, hyphens, and apostrophes',
  })
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email?: string;
}

/**
 * GraphQL Input for Changing Password
 */
@InputType()
export class ChangePasswordInput {
  @Field()
  @IsNotEmpty({ message: 'Current password is required' })
  @IsString()
  currentPassword!: string;

  @Field()
  @IsNotEmpty({ message: 'New password is required' })
  @IsString()
  @MinLength(8, { message: 'New password must be at least 8 characters' })
  newPassword!: string;
}
