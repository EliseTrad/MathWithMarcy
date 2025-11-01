import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

/**
 * DTO for changing user password.
 * Validates both current and new password inputs.
 */
export class ChangePasswordDto {
  @IsString({ message: 'Current password must be a string.' })
  @IsNotEmpty({ message: 'Current password is required.' })
  @MinLength(8, {
    message: 'Current password must be at least 8 characters long.',
  })
  @MaxLength(255, {
    message: 'Current password must not exceed 255 characters.',
  })
  currentPassword!: string;

  @IsString({ message: 'New password must be a string.' })
  @IsNotEmpty({ message: 'New password is required.' })
  @MinLength(8, { message: 'New password must be at least 8 characters long.' })
  @MaxLength(255, { message: 'New password must not exceed 255 characters.' })
  newPassword!: string;
}
