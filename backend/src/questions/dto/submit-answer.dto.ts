import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

/**
 * DTO for submitting an answer to a question with validation.
 */
export class SubmitAnswerDto {
  @IsString({ message: 'Answer must be a text value' })
  @IsNotEmpty({ message: 'Answer is required' })
  @MaxLength(255, { message: 'Answer cannot exceed 255 characters' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  userAnswer!: string;
}
