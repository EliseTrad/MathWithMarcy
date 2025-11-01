/**
 * Type definitions for questions and answers
 */

export type Topic = 'Geometry' | 'Arithmetic' | 'Algebra' | 'Word Problem';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export const TOPICS: Topic[] = [
  'Geometry',
  'Arithmetic',
  'Algebra',
  'Word Problem',
];

export const DIFFICULTIES: Difficulty[] = ['Easy', 'Medium', 'Hard'];

export interface Question {
  question_id: number;
  topic: string;
  difficulty: string;
  question_text: string;
  correct_answer: string;
  hint: string | null;
}

export interface SubmitAnswerRequest {
  userAnswer: string;
}

export interface SubmitAnswerResponse {
  message: string;
  isCorrect: boolean;
  correctAnswer?: string;
}

export interface GetQuestionsParams {
  topic?: Topic;
  difficulty?: Difficulty;
  random?: boolean;
}
