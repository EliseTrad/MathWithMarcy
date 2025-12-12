/**
 * Apollo Client configuration for GraphQL communication with the backend
 */
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

const TOKEN_STORAGE_KEY = 'mathWithMarcy.token';

/**
 * Determine the GraphQL API endpoint URL
 */
const resolveGraphQLUrl = (): string => {
  const metaEnv = (
    import.meta as unknown as { env?: Record<string, string | undefined> }
  )?.env;

  const baseUrl =
    metaEnv?.VITE_API_URL ??
    metaEnv?.REACT_APP_API_URL ??
    'http://localhost:3000';

  return `${baseUrl}/graphql`;
};

/**
 * HTTP link to the GraphQL endpoint
 */
const httpLink = createHttpLink({
  uri: resolveGraphQLUrl(),
});

/**
 * Auth link to attach JWT token to requests
 */
const authLink = setContext((_, { headers }) => {
  const token =
    localStorage.getItem(TOKEN_STORAGE_KEY) ??
    sessionStorage.getItem(TOKEN_STORAGE_KEY);

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

/**
 * Error link to handle GraphQL and network errors
 */
const errorLink = onError((errorResponse) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const errors = (errorResponse as any).graphQLErrors;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const networkErr = (errorResponse as any).networkError;

  if (errors) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    errors.forEach((error: any) => {
      console.error(
        `[GraphQL error]: Message: ${error.message}, Location: ${error.locations}, Path: ${error.path}`
      );
    });
  }

  if (networkErr) {
    console.error(`[Network error]: ${networkErr}`);
  }
});

/**
 * Apollo Client instance
 */
export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

export default apolloClient;
