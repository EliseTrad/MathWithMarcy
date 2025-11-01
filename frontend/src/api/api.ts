/**
 * Shared Axios instance used across the frontend for communicating with the Nest backend.
 */
import axios from 'axios';
import type {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

const TOKEN_STORAGE_KEY = 'mathWithMarcy.token';

type ErrorPayload = {
  message?: string | string[];
  errors?: Record<string, string | string[]>;
};

/**
 * Determine the API base URL, preferring Vite/CRA env vars with a fallback to localhost.
 */
const resolveBaseUrl = (): string => {
  const metaEnv = (
    import.meta as unknown as { env?: Record<string, string | undefined> }
  )?.env;

  return (
    metaEnv?.VITE_API_URL ??
    metaEnv?.REACT_APP_API_URL ??
    'http://localhost:3000'
  );
};

const api: AxiosInstance = axios.create({
  baseURL: resolveBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Attach stored JWT token to every outbound request when present.
 */
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token =
    localStorage.getItem(TOKEN_STORAGE_KEY) ??
    sessionStorage.getItem(TOKEN_STORAGE_KEY);

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/**
 * Surface standardized error payloads to calling code while preserving validation details.
 */
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<ErrorPayload>) => {
    if (error.response) {
      const payload = error.response.data;

      if (payload?.errors || payload?.message) {
        return Promise.reject(error);
      }

      return Promise.reject({
        ...error,
        message: 'Something went wrong. Please try again.',
      });
    }

    if (error.request) {
      return Promise.reject({
        ...error,
        message: 'Network error. Please check your connection and retry.',
      });
    }

    return Promise.reject({
      ...error,
      message: 'Unexpected error occurred. Please try again.',
    });
  }
);

export default api;
