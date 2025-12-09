import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { UserStatistics } from '../../types/statistics';
import apolloClient from '../../graphql/client';
import {
  GET_USER_STATISTICS_QUERY,
  type UserStatisticsResponse,
} from '../../graphql/operations';

/**
 * Statistics State Types
 */
type StatisticsState = {
  statistics: UserStatistics | null;
  isLoading: boolean;
  error: string | null;
  lastFetchedAt: number | null;
};

/**
 * Async Thunks
 */
export const fetchUserStatistics = createAsyncThunk<
  UserStatistics,
  void,
  { rejectValue: string }
>('statistics/fetchUserStatistics', async (_, { rejectWithValue }) => {
  try {
    const result = await apolloClient.query<UserStatisticsResponse>({
      query: GET_USER_STATISTICS_QUERY,
    });

    if (!result.data) {
      return rejectWithValue('Failed to fetch statistics');
    }

    // Map GraphQL response to frontend format
    const stats = result.data.myStatistics;
    return {
      totalAnswered: stats.totalAnswered,
      correctAnswers: stats.correctAnswers,
      accuracy: stats.accuracy,
      topics: {
        geometry: {
          answered: stats.topics.geometry.answered,
          correct: stats.topics.geometry.correct,
          byDifficulty: stats.topics.geometry.byDifficulty,
        },
        algebra: {
          answered: stats.topics.algebra.answered,
          correct: stats.topics.algebra.correct,
          byDifficulty: stats.topics.algebra.byDifficulty,
        },
        arithmetic: {
          answered: stats.topics.arithmetic.answered,
          correct: stats.topics.arithmetic.correct,
          byDifficulty: stats.topics.arithmetic.byDifficulty,
        },
        wordProblem: {
          answered: stats.topics.wordProblem.answered,
          correct: stats.topics.wordProblem.correct,
          byDifficulty: stats.topics.wordProblem.byDifficulty,
        },
      },
      difficulties: stats.difficulties,
    };
  } catch (error) {
    const message =
      (error as Error).message ??
      'Unable to load statistics. Please try again.';
    return rejectWithValue(message);
  }
});

/**
 * Initial State
 */
const initialState: StatisticsState = {
  statistics: null,
  isLoading: false,
  error: null,
  lastFetchedAt: null,
};

/**
 * Statistics Slice
 */
const statisticsSlice = createSlice({
  name: 'statistics',
  initialState,
  reducers: {
    clearStatistics: (state) => {
      state.statistics = null;
      state.error = null;
      state.lastFetchedAt = null;
    },
    clearStatisticsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserStatistics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserStatistics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.statistics = action.payload;
        state.error = null;
        state.lastFetchedAt = Date.now();
      })
      .addCase(fetchUserStatistics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Failed to fetch statistics';
      });
  },
});

export const { clearStatistics, clearStatisticsError } =
  statisticsSlice.actions;

export default statisticsSlice.reducer;
