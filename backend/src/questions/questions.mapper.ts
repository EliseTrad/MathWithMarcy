import { Question } from './question.entity';
import { QuestionType } from './questions.types';

/**
 * Maps Question entity to QuestionType GraphQL type
 * Converts snake_case entity fields to camelCase GraphQL fields
 */
export function mapQuestionToGraphQL(question: Question): QuestionType {
  return {
    question_id: question.question_id,
    topic: question.topic,
    difficulty: question.difficulty,
    question_text: question.question_text,
    correct_answer: question.correct_answer,
    hint: question.hint,
    created_at: question.created_at,
    updated_at: question.updated_at,
  };
}

/**
 * Maps array of Question entities to array of QuestionType GraphQL types
 */
export function mapQuestionsToGraphQL(questions: Question[]): QuestionType[] {
  return questions.map(mapQuestionToGraphQL);
}
