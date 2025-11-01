import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { AxiosError } from 'axios';

import api from '../api/api';

/** Lightweight representation of the authenticated learner returned by the API. */
export type AuthUser = {
  user_id: number;
  name: string;
  email: string;
};

export type AuthActionResult = {
  success: boolean;
  message?: string;
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

type LoginResponse = {
  accessToken: string;
  user: AuthUser;
};

type RegisterResponse = {
  user_id: number;
  name: string;
  email: string;
};

/**
 * Public surface area exposed by the authentication context.
 */
type AuthContextValue = {
  isAuthenticated: boolean;
  user: AuthUser | null;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<AuthActionResult>;
  register: (payload: RegisterPayload) => Promise<AuthActionResult>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_STORAGE_KEY = 'mathWithMarcy.token';
const USER_STORAGE_KEY = 'mathWithMarcy.user';

type StorageScope = 'local' | 'session';

const getStorage = (scope: StorageScope): Storage =>
  scope === 'local' ? localStorage : sessionStorage;

/**
 * AuthProvider bootstraps persisted tokens, exposes auth helpers, and
 * keeps user data available throughout the application tree.
 */
export const AuthProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  /** Restore persisted authentication state on initial mount. */
  useEffect(() => {
    const storedToken =
      localStorage.getItem(TOKEN_STORAGE_KEY) ??
      sessionStorage.getItem(TOKEN_STORAGE_KEY);
    const storedUser =
      localStorage.getItem(USER_STORAGE_KEY) ??
      sessionStorage.getItem(USER_STORAGE_KEY);

    if (storedToken) {
      setToken(storedToken);
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(USER_STORAGE_KEY);
        sessionStorage.removeItem(USER_STORAGE_KEY);
      }
    }
  }, []);

  /** Persist token + user information in both state and storage. */
  const storeSession = useCallback(
    (nextToken: string, nextUser: AuthUser, scope: StorageScope) => {
      setToken(nextToken);
      setUser(nextUser);

      const targetStorage = getStorage(scope);
      const alternateStorage = getStorage(
        scope === 'local' ? 'session' : 'local'
      );

      targetStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
      targetStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));

      alternateStorage.removeItem(TOKEN_STORAGE_KEY);
      alternateStorage.removeItem(USER_STORAGE_KEY);
    },
    []
  );

  /** Remove token + user from memory and browser storage. */
  const clearSession = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(USER_STORAGE_KEY);
  }, []);

  /**
   * login
   *
   * Performs the POST /auth/login call, handles persistence, and returns a
   * status object that can be used to surface user-friendly feedback.
   */
  const login = useCallback(
    async (credentials: LoginCredentials): Promise<AuthActionResult> => {
      try {
        const response = await api.post<LoginResponse>('/auth/login', {
          email: credentials.email.trim().toLowerCase(),
          password: credentials.password,
        });

        const storageScope: StorageScope = credentials.remember
          ? 'local'
          : 'session';

        storeSession(
          response.data.accessToken,
          response.data.user,
          storageScope
        );

        return { success: true };
      } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;

        const message =
          axiosError.response?.data?.message ??
          'Unable to sign in. Please check your credentials and try again.';
        return { success: false, message };
      }
    },
    [storeSession]
  );

  /**
   * register
   *
   * Creates a new learner via POST /auth/register. Optionally logs them in when
   * `autoLogin` is requested. Returns actionable status messages for UI layers.
   */
  const register = useCallback(
    async (payload: RegisterPayload): Promise<AuthActionResult> => {
      const trimmedName = payload.name.trim();

      try {
        await api.post<RegisterResponse>('/auth/register', {
          name: trimmedName,
          email: payload.email.trim().toLowerCase(),
          password: payload.password,
        });

        if (payload.autoLogin) {
          return login({
            email: payload.email,
            password: payload.password,
            remember: payload.remember,
          });
        }

        return { success: true };
      } catch (error) {
        const axiosError = error as AxiosError<{ message?: string | string[] }>;

        const responseMessage = axiosError.response?.data?.message;
        const message = Array.isArray(responseMessage)
          ? responseMessage.join('\n')
          : responseMessage ??
            'Unable to complete registration. Please try again.';

        return { success: false, message };
      }
    },
    [login]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(token),
      user,
      token,
      login,
      register,
      logout: clearSession,
    }),
    [clearSession, login, register, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Convenience hook for consuming the AuthContext inside React components.
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export default AuthContext;
