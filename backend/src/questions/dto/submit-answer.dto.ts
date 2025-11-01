import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

/**
 * DTO for submitting an answer to a question.
 */
export class SubmitAnswerDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  userAnswer!: string;
}
