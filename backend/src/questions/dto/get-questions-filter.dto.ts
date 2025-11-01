import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum Topic {
  GEOMETRY = 'Geometry',
  ARITHMETIC = 'Arithmetic',
  ALGEBRA = 'Algebra',
  WORD_PROBLEM = 'Word Problem',
}

export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard',
}

/**
 * DTO for filtering questions by topic and difficulty.
 */
export class GetQuestionsFilterDto {
  @IsOptional()
  @IsEnum(Topic, { message: 'Topic must be a valid category.' })
  topic?: Topic;

  @IsOptional()
  @IsEnum(Difficulty, { message: 'Difficulty must be Easy, Medium, or Hard.' })
  difficulty?: Difficulty;

  @IsOptional()
  @IsString()
  random?: string; // 'true' or 'false' as query param
}
