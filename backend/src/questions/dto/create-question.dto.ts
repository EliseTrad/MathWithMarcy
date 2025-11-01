import { Transform } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

/**
 * DTO for creating a Question.
 * Performs minimal input validation and trims incoming strings.
 */
export class CreateQuestionDto {
  /** Topic/category of the question */
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  topic!: string;

  /** Difficulty level: Easy | Medium | Hard */
  @IsString()
  @IsNotEmpty()
  @IsIn(['Easy', 'Medium', 'Hard'])
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  difficulty!: 'Easy' | 'Medium' | 'Hard';

  /** Full question prompt */
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  question_text!: string;

  /** Canonical correct answer */
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  correct_answer!: string;

  /** Optional hint shown to learners */
  @IsString()
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value !== 'string') return value;
    const v = value.trim();
    return v.length === 0 ? undefined : v;
  })
  hint?: string;
}
