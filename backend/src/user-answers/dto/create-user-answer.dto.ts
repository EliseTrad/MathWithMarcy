import { Type, Transform } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

/**
 * DTO for creating a UserAnswer record.
 * Validates required IDs and optional textual answer.
 */
export class CreateUserAnswerDto {
  /** ID of the user submitting the answer */
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  user_id!: number;

  /** ID of the question being answered */
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  question_id!: number;

  /** The answer provided by the user (optional string) */
  @IsOptional()
  @IsString()
  @MaxLength(1024)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  user_answer?: string;

  /** Whether the provided answer is correct (true/false) */
  @IsBoolean()
  @IsOptional()
  is_correct?: boolean;
}
