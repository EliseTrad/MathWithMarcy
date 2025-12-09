import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

/**
 * UI State Types
 */
type NotificationSeverity = 'success' | 'error' | 'warning' | 'info';

type Notification = {
  id: string;
  message: string;
  severity: NotificationSeverity;
  autoHideDuration?: number;
};

type Modal = {
  id: string;
  isOpen: boolean;
  data?: unknown;
};

type UiState = {
  notifications: Notification[];
  modals: Record<string, Modal>;
  isGlobalLoading: boolean;
  theme: 'light' | 'dark';
};

/**
 * Initial State
 */
const initialState: UiState = {
  notifications: [],
  modals: {},
  isGlobalLoading: false,
  theme: 'light',
};

/**
 * UI Slice
 */
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Notifications
    addNotification: (
      state,
      action: PayloadAction<Omit<Notification, 'id'>>
    ) => {
      const notification: Notification = {
        id: `notification-${Date.now()}-${Math.random()}`,
        ...action.payload,
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    },

    // Modals
    openModal: (
      state,
      action: PayloadAction<{ id: string; data?: unknown }>
    ) => {
      state.modals[action.payload.id] = {
        id: action.payload.id,
        isOpen: true,
        data: action.payload.data,
      };
    },
    closeModal: (state, action: PayloadAction<string>) => {
      if (state.modals[action.payload]) {
        state.modals[action.payload].isOpen = false;
      }
    },
    removeModal: (state, action: PayloadAction<string>) => {
      delete state.modals[action.payload];
    },

    // Global Loading
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.isGlobalLoading = action.payload;
    },

    // Theme
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
  },
});

export const {
  addNotification,
  removeNotification,
  clearAllNotifications,
  openModal,
  closeModal,
  removeModal,
  setGlobalLoading,
  setTheme,
  toggleTheme,
} = uiSlice.actions;

export default uiSlice.reducer;
