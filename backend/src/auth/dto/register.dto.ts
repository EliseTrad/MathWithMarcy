import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  IsValidName,
  IsStrongPassword,
} from '../../common/validators/custom.validators';

/**
 * DTO for user registration with comprehensive validation
 * Ensures data integrity before reaching the service layer
 */
export class RegisterDto {
  @IsString({ message: 'Name must be a text value' })
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Name cannot exceed 100 characters' })
  @IsValidName()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  name!: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  @MaxLength(150, { message: 'Email cannot exceed 150 characters' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value
  )
  email!: string;

  @IsString({ message: 'Password must be a text value' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(255, { message: 'Password cannot exceed 255 characters' })
  @IsStrongPassword()
  password!: string;
}
