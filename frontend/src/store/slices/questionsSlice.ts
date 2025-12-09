import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Question, Topic, Difficulty } from '../../types/questions';
import apolloClient from '../../graphql/client';
import {
  GET_QUESTIONS_QUERY,
  SUBMIT_ANSWER_MUTATION,
  type GetQuestionsResponse,
  type SubmitAnswerResponse,
} from '../../graphql/operations';

type AnswerResponse = {
  is_correct: boolean;
  message: string;
  correct_answer?: string;
};

/**
 * Questions State Types
 */
type QuestionsState = {
  selectedTopic: Topic | null;
  selectedDifficulty: Difficulty | null;
  questions: Question[];
  currentQuestionIndex: number;
  userAnswer: string;
  isSubmitting: boolean;
  feedback: AnswerResponse | null;
  showHint: boolean;
  score: number;
  error: string | null;
};

type FetchQuestionsPayload = {
  topic: Topic;
  difficulty: Difficulty;
  limit?: number;
};

type SubmitAnswerPayload = {
  questionId: number;
  userAnswer: string;
};

/**
 * Async Thunks
 */
export const fetchQuestions = createAsyncThunk<
  Question[],
  FetchQuestionsPayload,
  { rejectValue: string }
>('questions/fetchQuestions', async (filters, { rejectWithValue }) => {
  try {
    const result = await apolloClient.query<GetQuestionsResponse>({
      query: GET_QUESTIONS_QUERY,
      variables: {
        topic: filters.topic,
        difficulty: filters.difficulty,
        limit: filters.limit ?? 10,
      },
    });

    if (!result.data) {
      return rejectWithValue('Failed to fetch questions');
    }

    return result.data.questions;
  } catch (error) {
    const message =
      (error as Error).message ?? 'Unable to load questions. Please try again.';
    return rejectWithValue(message);
  }
});

export const submitAnswer = createAsyncThunk<
  AnswerResponse,
  SubmitAnswerPayload,
  { rejectValue: string }
>(
  'questions/submitAnswer',
  async ({ questionId, userAnswer }, { rejectWithValue }) => {
    try {
      const result = await apolloClient.mutate<SubmitAnswerResponse>({
        mutation: SUBMIT_ANSWER_MUTATION,
        variables: {
          questionId,
          userAnswer: userAnswer.trim(),
        },
      });

      if (!result.data) {
        return rejectWithValue('Failed to submit answer');
      }

      return result.data.submitAnswer;
    } catch (error) {
      const message =
        (error as Error).message ??
        'Unable to submit answer. Please try again.';
      return rejectWithValue(message);
    }
  }
);

/**
 * Initial State
 */
const initialState: QuestionsState = {
  selectedTopic: null,
  selectedDifficulty: null,
  questions: [],
  currentQuestionIndex: 0,
  userAnswer: '',
  isSubmitting: false,
  feedback: null,
  showHint: false,
  score: 0,
  error: null,
};

/**
 * Questions Slice
 */
const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    setSelectedTopic: (state, action: PayloadAction<Topic>) => {
      state.selectedTopic = action.payload;
    },
    setSelectedDifficulty: (state, action: PayloadAction<Difficulty>) => {
      state.selectedDifficulty = action.payload;
    },
    setUserAnswer: (state, action: PayloadAction<string>) => {
      state.userAnswer = action.payload;
    },
    toggleShowHint: (state) => {
      state.showHint = !state.showHint;
    },
    setShowHint: (state, action: PayloadAction<boolean>) => {
      state.showHint = action.payload;
    },
    nextQuestion: (state) => {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex += 1;
        state.userAnswer = '';
        state.feedback = null;
        state.showHint = false;
      }
    },
    previousQuestion: (state) => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
        state.userAnswer = '';
        state.feedback = null;
        state.showHint = false;
      }
    },
    resetQuiz: (state) => {
      state.currentQuestionIndex = 0;
      state.userAnswer = '';
      state.feedback = null;
      state.showHint = false;
      state.score = 0;
      state.questions = [];
      state.error = null;
    },
    clearFeedback: (state) => {
      state.feedback = null;
    },
    clearQuestionsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Questions
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.questions = action.payload;
        state.currentQuestionIndex = 0;
        state.userAnswer = '';
        state.feedback = null;
        state.showHint = false;
        state.score = 0;
        state.error = null;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.error = action.payload ?? 'Failed to fetch questions';
        state.questions = [];
      });

    // Submit Answer
    builder
      .addCase(submitAnswer.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(submitAnswer.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.feedback = action.payload;
        if (action.payload.is_correct) {
          state.score += 1;
        }
      })
      .addCase(submitAnswer.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload ?? 'Failed to submit answer';
      });
  },
});

export const {
  setSelectedTopic,
  setSelectedDifficulty,
  setUserAnswer,
  toggleShowHint,
  setShowHint,
  nextQuestion,
  previousQuestion,
  resetQuiz,
  clearFeedback,
  clearQuestionsError,
} = questionsSlice.actions;

export default questionsSlice.reducer;
