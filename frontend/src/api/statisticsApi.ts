/**
 * API functions for statistics endpoints
 */
import api from './api';
import type { UserStatistics } from '../types/statistics';

/**
 * Fetch statistics for the current user
 */
export const getUserStatistics = async (): Promise<UserStatistics> => {
  const response = await api.get<UserStatistics>('/user-answers/statistics/me');
  return response.data;
};
