import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import apolloClient from '../../graphql/client';
import {
  LOGIN_MUTATION,
  REGISTER_MUTATION,
  type LoginResponse as GQLLoginResponse,
  type RegisterResponse as GQLRegisterResponse,
} from '../../graphql/operations';

/**
 * Auth State Types
 */
export type AuthUser = {
  user_id: number;
  name: string;
  email: string;
};

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};

type LoginCredentials = {
  email: string;
  password: string;
  remember?: boolean;
};

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  autoLogin?: boolean;
  remember?: boolean;
};

/**
 * Storage Keys and Utilities
 */
const TOKEN_STORAGE_KEY = 'mathWithMarcy.token';
const USER_STORAGE_KEY = 'mathWithMarcy.user';

type StorageScope = 'local' | 'session';

const getStorage = (scope: StorageScope): Storage =>
  scope === 'local' ? localStorage : sessionStorage;

const storeSession = (
  token: string,
  user: AuthUser,
  scope: StorageScope
): void => {
  const targetStorage = getStorage(scope);
  const alternateStorage = getStorage(scope === 'local' ? 'session' : 'local');

  targetStorage.setItem(TOKEN_STORAGE_KEY, token);
  targetStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

  alternateStorage.removeItem(TOKEN_STORAGE_KEY);
  alternateStorage.removeItem(USER_STORAGE_KEY);
};

const clearSession = (): void => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
  sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  sessionStorage.removeItem(USER_STORAGE_KEY);
};

const loadPersistedSession = (): Pick<
  AuthState,
  'token' | 'user' | 'isAuthenticated'
> => {
  const storedToken =
    localStorage.getItem(TOKEN_STORAGE_KEY) ??
    sessionStorage.getItem(TOKEN_STORAGE_KEY);
  const storedUser =
    localStorage.getItem(USER_STORAGE_KEY) ??
    sessionStorage.getItem(USER_STORAGE_KEY);

  if (storedToken && storedUser) {
    try {
      const user = JSON.parse(storedUser) as AuthUser;
      return { token: storedToken, user, isAuthenticated: true };
    } catch {
      clearSession();
    }
  }

  return { token: null, user: null, isAuthenticated: false };
};

/**
 * Async Thunks
 */
export const loginUser = createAsyncThunk<
  { token: string; user: AuthUser; remember: boolean },
  LoginCredentials,
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const result = await apolloClient.mutate<GQLLoginResponse>({
      mutation: LOGIN_MUTATION,
      variables: {
        email: credentials.email.trim().toLowerCase(),
        password: credentials.password,
      },
    });

    if (!result.data) {
      return rejectWithValue('Login failed');
    }

    return {
      token: result.data.login.accessToken,
      user: result.data.login.user,
      remember: credentials.remember ?? false,
    };
  } catch (error) {
    const message =
      (error as Error).message ??
      'Unable to sign in. Please check your credentials and try again.';
    return rejectWithValue(message);
  }
});

export const registerUser = createAsyncThunk<
  { user?: AuthUser; token?: string; remember: boolean } | void,
  RegisterPayload,
  { rejectValue: string }
>('auth/register', async (payload, { rejectWithValue, dispatch }) => {
  try {
    const result = await apolloClient.mutate<GQLRegisterResponse>({
      mutation: REGISTER_MUTATION,
      variables: {
        name: payload.name.trim(),
        email: payload.email.trim().toLowerCase(),
        password: payload.password,
      },
    });

    if (!result.data) {
      return rejectWithValue('Registration failed');
    }

    if (payload.autoLogin) {
      const loginResult = await dispatch(
        loginUser({
          email: payload.email,
          password: payload.password,
          remember: payload.remember,
        })
      );

      if (loginUser.fulfilled.match(loginResult)) {
        return {
          user: loginResult.payload.user,
          token: loginResult.payload.token,
          remember: loginResult.payload.remember,
        };
      }
    }

    return undefined;
  } catch (error) {
    const message =
      (error as Error).message ??
      'Unable to complete registration. Please try again.';
    return rejectWithValue(message);
  }
});

/**
 * Initial State
 */
const initialState: AuthState = {
  ...loadPersistedSession(),
  isLoading: false,
  error: null,
};

/**
 * Auth Slice
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      clearSession();
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;

        const storageScope: StorageScope = action.payload.remember
          ? 'local'
          : 'session';
        storeSession(action.payload.token, action.payload.user, storageScope);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Login failed';
        state.isAuthenticated = false;
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;

        if (action.payload && action.payload.user && action.payload.token) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;

          const storageScope: StorageScope = action.payload.remember
            ? 'local'
            : 'session';
          storeSession(action.payload.token, action.payload.user, storageScope);
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Registration failed';
      });
  },
});

export const { logout, clearAuthError, setUser } = authSlice.actions;
export default authSlice.reducer;
