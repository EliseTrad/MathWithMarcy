/**
 * API functions for questions endpoints
 */
import api from './api';
import type {
  Question,
  GetQuestionsParams,
  SubmitAnswerRequest,
  SubmitAnswerResponse,
} from '../types/questions';

/**
 * Fetch questions based on filters
 */
export const getQuestions = async (
  params: GetQuestionsParams
): Promise<Question[]> => {
  const queryParams = new URLSearchParams();

  if (params.topic) queryParams.append('topic', params.topic);
  if (params.difficulty) queryParams.append('difficulty', params.difficulty);
  if (params.random) queryParams.append('random', 'true');

  const url = `/questions?${queryParams.toString()}`;

  const response = await api.get<{ questions: Question[] }>(url);
  return response.data.questions;
};

/**
 * Submit an answer to a question
 */
export const submitAnswer = async (
  questionId: number,
  userAnswer: string
): Promise<SubmitAnswerResponse> => {
  const payload: SubmitAnswerRequest = { userAnswer };
  const response = await api.post<SubmitAnswerResponse>(
    `/questions/${questionId}/answer`,
    payload
  );
  return response.data;
};
