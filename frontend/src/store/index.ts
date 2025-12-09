import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import authReducer from './slices/authSlice';
import questionsReducer from './slices/questionsSlice';
import statisticsReducer from './slices/statisticsSlice';
import uiReducer from './slices/uiSlice';
import formReducer from './slices/formSlice';

/**
 * Redux Store Configuration
 *
 * Combines all feature slices:
 * - auth: User authentication and session management
 * - questions: Practice questions and quiz state
 * - statistics: User performance metrics and analytics
 * - ui: Global UI state (notifications, modals, theme)
 * - form: Form state for login, register, profile, and dashboard
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    questions: questionsReducer,
    statistics: statisticsReducer,
    ui: uiReducer,
    form: formReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serialization warnings
        ignoredActions: ['ui/openModal'],
        // Ignore these field paths in the state
        ignoredActionPaths: ['payload.data'],
        ignoredPaths: ['ui.modals'],
      },
    }),
});

/**
 * TypeScript Types
 */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

/**
 * Typed Hooks
 *
 * Use these hooks instead of plain `useDispatch` and `useSelector`
 * to get proper TypeScript type inference throughout the application.
 *
 * @example
 * const dispatch = useAppDispatch();
 * const user = useAppSelector((state) => state.auth.user);
 */
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
