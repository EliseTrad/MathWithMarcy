import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface HandwritingState {
  // Input mode: 'keyboard' or 'handwriting'
  inputMode: 'keyboard' | 'handwriting';

  // Recognition results
  recognizedText: string | null;
  confidence: number | null;

  // Loading state
  isRecognizing: boolean;
  recognitionError: string | null;

  // Answer validation
  isCorrect: boolean | null;
  feedback: string | null;
  points: number;

  // Bonus tracking
  handwritingStreak: number; // Consecutive correct handwritten answers
  totalHandwrittenAnswers: number;
  correctHandwrittenAnswers: number;
}

const initialState: HandwritingState = {
  inputMode: 'keyboard',
  recognizedText: null,
  confidence: null,
  isRecognizing: false,
  recognitionError: null,
  isCorrect: null,
  feedback: null,
  points: 0,
  handwritingStreak: 0,
  totalHandwrittenAnswers: 0,
  correctHandwrittenAnswers: 0,
};

/**
 * Handwriting Redux Slice
 *
 * Manages state for handwriting recognition including:
 * - Input mode toggle (keyboard vs handwriting)
 * - Recognition results and confidence
 * - Answer validation and feedback
 * - Gamification (streaks, points, accuracy)
 */
const handwritingSlice = createSlice({
  name: 'handwriting',
  initialState,
  reducers: {
    /**
     * Toggle between keyboard and handwriting input
     */
    setInputMode(state, action: PayloadAction<'keyboard' | 'handwriting'>) {
      state.inputMode = action.payload;
      // Clear recognition state when switching modes
      if (action.payload === 'keyboard') {
        state.recognizedText = null;
        state.confidence = null;
        state.recognitionError = null;
      }
    },

    /**
     * Set recognition loading state
     */
    setRecognizing(state, action: PayloadAction<boolean>) {
      state.isRecognizing = action.payload;
      if (action.payload) {
        state.recognitionError = null;
      }
    },

    /**
     * Store recognition results
     */
    setRecognitionResult(
      state,
      action: PayloadAction<{
        recognizedText: string;
        confidence: number;
        isCorrect: boolean;
        feedback: string;
        points: number;
      }>
    ) {
      state.recognizedText = action.payload.recognizedText;
      state.confidence = action.payload.confidence;
      state.isCorrect = action.payload.isCorrect;
      state.feedback = action.payload.feedback;
      state.points = action.payload.points;
      state.isRecognizing = false;
      state.recognitionError = null;

      // Update statistics
      state.totalHandwrittenAnswers += 1;
      if (action.payload.isCorrect) {
        state.correctHandwrittenAnswers += 1;
        state.handwritingStreak += 1;
      } else {
        state.handwritingStreak = 0;
      }
    },

    /**
     * Set recognition error
     */
    setRecognitionError(state, action: PayloadAction<string>) {
      state.recognitionError = action.payload;
      state.isRecognizing = false;
      state.recognizedText = null;
      state.confidence = null;
    },

    /**
     * Clear recognition results (for new question)
     */
    clearRecognition(state) {
      state.recognizedText = null;
      state.confidence = null;
      state.isCorrect = null;
      state.feedback = null;
      state.points = 0;
      state.recognitionError = null;
    },

    /**
     * Reset handwriting state (logout or reset)
     */
    resetHandwriting() {
      return { ...initialState };
    },

    /**
     * Reset streak only
     */
    resetStreak(state) {
      state.handwritingStreak = 0;
    },
  },
});

export const {
  setInputMode,
  setRecognizing,
  setRecognitionResult,
  setRecognitionError,
  clearRecognition,
  resetHandwriting,
  resetStreak,
} = handwritingSlice.actions;

export default handwritingSlice.reducer;
