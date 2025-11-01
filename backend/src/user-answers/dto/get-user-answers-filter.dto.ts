import { Type } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';

const Difficulty = ['Easy', 'Medium', 'Hard'] as const;
const Topic = ['Geometry', 'Algebra', 'Arithmetic', 'Word Problem'] as const;

export type DifficultyType = (typeof Difficulty)[number];
export type TopicType = (typeof Topic)[number];

/**
 * Query DTO for filtering user answers by topic and difficulty.
 * Both fields are optional and validated via enums; values coerced to string.
 */
export class GetUserAnswersFilterDto {
  @IsOptional()
  @IsEnum(Difficulty, {
    message: 'difficulty must be one of: Easy, Medium, Hard',
  })
  @Type(() => String)
  difficulty?: DifficultyType;

  @IsOptional()
  @IsEnum(Topic, {
    message:
      'topic must be one of: Geometry, Algebra, Arithmetic, Word Problem',
  })
  @Type(() => String)
  topic?: TopicType;
}
