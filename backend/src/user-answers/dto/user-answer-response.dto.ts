/**
 * DTO for user answer response with question details.
 * Used when retrieving user answer history with full context.
 */
export class UserAnswerResponseDto {
  questionText!: string;
  topic!: string;
  difficulty!: string;
  userAnswer!: string;
  isCorrect!: boolean;
}
