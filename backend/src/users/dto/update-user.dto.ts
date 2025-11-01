import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

/**
 * DTO for updating user profile information.
 * All fields are optional since users can update one or more fields.
 */
export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string.' })
  @MinLength(1, { message: 'Name cannot be empty.' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters.' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address.' })
  @MaxLength(150, { message: 'Email must not exceed 150 characters.' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value
  )
  email?: string;
}
