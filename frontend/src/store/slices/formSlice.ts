import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface FieldErrors {
  [key: string]: string;
}

interface LoginFormState {
  email: string;
  password: string;
  remember: boolean;
  fieldErrors: FieldErrors;
}

interface RegisterFormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  remember: boolean;
  fieldErrors: FieldErrors;
  registrationCompleted: boolean;
}

interface ProfileFormState {
  editing: {
    name?: boolean;
    email?: boolean;
  };
  name: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  passwordError: string | null;
  isSaving: boolean;
  showDeleteConfirm: boolean;
  passwordFlowOpen: boolean;
  alert: {
    type: 'success' | 'error' | 'info';
    message: string;
  } | null;
}

interface DashboardState {
  encouragement: string;
}

interface FormState {
  login: LoginFormState;
  register: RegisterFormState;
  profile: ProfileFormState;
  dashboard: DashboardState;
}

const initialState: FormState = {
  login: {
    email: '',
    password: '',
    remember: false,
    fieldErrors: {},
  },
  register: {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    remember: true,
    fieldErrors: {},
    registrationCompleted: false,
  },
  profile: {
    editing: {},
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    passwordError: null,
    isSaving: false,
    showDeleteConfirm: false,
    passwordFlowOpen: false,
    alert: null,
  },
  dashboard: {
    encouragement: '',
  },
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    // Login form actions
    setLoginField: (
      state,
      action: PayloadAction<{
        field: keyof LoginFormState;
        value: string | boolean | FieldErrors;
      }>
    ) => {
      const { field, value } = action.payload;
      (state.login as LoginFormState)[field] = value as never;
    },
    setLoginFieldError: (
      state,
      action: PayloadAction<{ field: string; error: string }>
    ) => {
      state.login.fieldErrors[action.payload.field] = action.payload.error;
    },
    clearLoginFieldError: (state, action: PayloadAction<string>) => {
      delete state.login.fieldErrors[action.payload];
    },
    resetLoginForm: (state) => {
      state.login = initialState.login;
    },

    // Register form actions
    setRegisterField: (
      state,
      action: PayloadAction<{
        field: keyof RegisterFormState;
        value: string | boolean | FieldErrors;
      }>
    ) => {
      const { field, value } = action.payload;
      (state.register as RegisterFormState)[field] = value as never;
    },
    setRegisterFieldError: (
      state,
      action: PayloadAction<{ field: string; error: string }>
    ) => {
      state.register.fieldErrors[action.payload.field] = action.payload.error;
    },
    clearRegisterFieldError: (state, action: PayloadAction<string>) => {
      delete state.register.fieldErrors[action.payload];
    },
    resetRegisterForm: (state) => {
      state.register = initialState.register;
    },

    // Profile form actions
    setProfileEditing: (
      state,
      action: PayloadAction<{ name?: boolean; email?: boolean }>
    ) => {
      state.profile.editing = action.payload;
    },
    setProfileName: (state, action: PayloadAction<string>) => {
      state.profile.name = action.payload;
    },
    setProfileEmail: (state, action: PayloadAction<string>) => {
      state.profile.email = action.payload;
    },
    setCurrentPassword: (state, action: PayloadAction<string>) => {
      state.profile.currentPassword = action.payload;
    },
    setNewPassword: (state, action: PayloadAction<string>) => {
      state.profile.newPassword = action.payload;
    },
    setConfirmPassword: (state, action: PayloadAction<string>) => {
      state.profile.confirmPassword = action.payload;
    },
    setPasswordError: (state, action: PayloadAction<string | null>) => {
      state.profile.passwordError = action.payload;
    },
    setProfileSaving: (state, action: PayloadAction<boolean>) => {
      state.profile.isSaving = action.payload;
    },
    setShowDeleteConfirm: (state, action: PayloadAction<boolean>) => {
      state.profile.showDeleteConfirm = action.payload;
    },
    setPasswordFlowOpen: (state, action: PayloadAction<boolean>) => {
      state.profile.passwordFlowOpen = action.payload;
    },
    setProfileAlert: (
      state,
      action: PayloadAction<{
        type: 'success' | 'error' | 'info';
        message: string;
      } | null>
    ) => {
      state.profile.alert = action.payload;
    },
    resetProfileForm: (state) => {
      state.profile = initialState.profile;
    },

    // Dashboard actions
    setDashboardEncouragement: (state, action: PayloadAction<string>) => {
      state.dashboard.encouragement = action.payload;
    },
  },
});

export const {
  setLoginField,
  setLoginFieldError,
  clearLoginFieldError,
  resetLoginForm,
  setRegisterField,
  setRegisterFieldError,
  clearRegisterFieldError,
  resetRegisterForm,
  setProfileEditing,
  setProfileName,
  setProfileEmail,
  setCurrentPassword,
  setNewPassword,
  setConfirmPassword,
  setPasswordError,
  setProfileSaving,
  setShowDeleteConfirm,
  setPasswordFlowOpen,
  setProfileAlert,
  resetProfileForm,
  setDashboardEncouragement,
} = formSlice.actions;

export default formSlice.reducer;
