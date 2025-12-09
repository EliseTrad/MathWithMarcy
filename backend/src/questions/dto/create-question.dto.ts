import { Transform } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

/**
 * DTO for creating a Question with comprehensive validation.
 * Ensures data quality and provides clear error messages.
 */
export class CreateQuestionDto {
  /** Topic/category of the question */
  @IsString({ message: 'Topic must be a text value' })
  @IsNotEmpty({ message: 'Topic is required' })
  @MaxLength(100, { message: 'Topic cannot exceed 100 characters' })
  @IsIn(['Geometry', 'Algebra', 'Arithmetic', 'WordProblem'], {
    message: 'Topic must be one of: Geometry, Algebra, Arithmetic, WordProblem',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  topic!: string;

  /** Difficulty level: Easy | Medium | Hard */
  @IsString({ message: 'Difficulty must be a text value' })
  @IsNotEmpty({ message: 'Difficulty is required' })
  @IsIn(['Easy', 'Medium', 'Hard'], {
    message: 'Difficulty must be one of: Easy, Medium, Hard',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  difficulty!: 'Easy' | 'Medium' | 'Hard';

  /** Full question prompt */
  @IsString({ message: 'Question text must be a text value' })
  @IsNotEmpty({ message: 'Question text is required' })
  @MinLength(10, {
    message: 'Question text must be at least 10 characters long',
  })
  @MaxLength(1000, { message: 'Question text cannot exceed 1000 characters' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  question_text!: string;

  /** Canonical correct answer */
  @IsString({ message: 'Correct answer must be a text value' })
  @IsNotEmpty({ message: 'Correct answer is required' })
  @MaxLength(255, { message: 'Correct answer cannot exceed 255 characters' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  correct_answer!: string;

  /** Optional hint shown to learners */
  @IsString({ message: 'Hint must be a text value' })
  @IsOptional()
  @MaxLength(500, { message: 'Hint cannot exceed 500 characters' })
  @Transform(({ value }) => {
    if (typeof value !== 'string') return value;
    const v = value.trim();
    return v.length === 0 ? undefined : v;
  })
  hint?: string;
}
