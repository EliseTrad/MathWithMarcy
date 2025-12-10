/**
 * DTO for answer submission result.
 * Encapsulates the outcome of checking an answer against the correct solution.
 */
export class AnswerResultDto {
  isCorrect!: boolean;
  correctAnswer!: string;
  userAnswerId!: number | null;
}
